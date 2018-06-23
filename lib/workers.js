var path = require('path');
var fs = require('fs');
var _data = require('./data');
var https = require('https');
var http = require('http');
var helpers = require('./helpers');
var url = require('url');
var _logs = require('./logs');
var workers = {};

workers.gatherAllChecks = function () {

	_data.list('checks', function (err, checks) {

			if(!err && 	checks && checks.length > 0) {

				checks.forEach(function (check) {

					_data.read('checks', check, function(err, originalCheckData) {

						if(!err && originalCheckData) {

							workers.validateCheckData(originalCheckData);

						} else{

							console.log("Error reading Check Data");
						}
					});
				});

			} else {

				console.log('Error: Could not find any checks to process');
			}
	});
};

workers.validateCheckData = function(originalCheckData) {

	originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
	originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
	originalCheckData.userPhone =  typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
	originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
	originalCheckData.url =  typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
	originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
	originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
	originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 == 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;

	originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : false;
	originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked % 1 == 0  ? originalCheckData.timeoutSeconds : false;

	if(originalCheckData.id && 
		originalCheckData.userPhone && 
		originalCheckData.protocol &&
		 originalCheckData.url && 
		 originalCheckData.method &&
		  originalCheckData.successCodes && 
		  originalCheckData.timeoutSeconds) {


		workers.performCheck(originalCheckData);

	} else {

		console.log('One of the checks is not properly formatted');
	}
};


workers.performCheck = function (originalCheckData) {

	var checkOutcome = {

		'error': false,
		'responseCode': false
	};

	var outcomeSent = false;

	var parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
	

	var hostName = parsedUrl.hostname;
	var path = parsedUrl.path;

	var requestDetails = {

		'protocol': originalCheckData.protocol+':',
		'hostname': hostName,
		'method': originalCheckData.method.toUpperCase(),
		'path': path,
		'timeout': originalCheckData.timeoutSeconds * 1000
	};

	var _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
	var req = _moduleToUse.request(requestDetails, function (res) {
		
		var status = res.statusCode;
		checkOutcome.responseCode = status;
		if(!outcomeSent) {

			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}

	});

	req.on('error', function(e) {

		checkOutcome.error = {'error': true, 'value': e};

		if(!outcomeSent) {

			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}

	});

	req.on('timeout', function(e) {

		checkOutcome.error = {'error': true, 'value': 'timeout'};

		if(!outcomeSent) {

			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}

	});

	req.end();


};

workers.processCheckOutcome = function(originalCheckData, checkOutcome) {


	var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

	var alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

	var timeofCheck = Date.now();
	workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeofCheck);

	var newCheckData = originalCheckData;
	newCheckData.state = state;
	newCheckData.lastChecked = Date.now();

	_data.update('checks', newCheckData.id, newCheckData, function(err) {

			if(!err) {

				if(alertWarranted) {

					workers.alertUserToStatusChange(newCheckData);

				} else {

					console.log('Check outcome has not changed so no alert needed');
				}

			} else{

				console.log('Error trying to update the check data');
			}
	});
};


workers.alertUserToStatusChange = function(newCheckData) {

	var msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently at ${newCheckData.state} state.`;

	helpers.sendTwilioSms(newCheckData.userPhone, msg, function (err) {

		if(!err) {

			console.log('User was alerted to their status check via a sms', msg);

		} else {

			console.log('Could not alert user for a state change for one of their checks');
		}

	});
};

workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeofCheck) {

	var logData = {

		'check': originalCheckData,
		'outcome': checkOutcome,
		'state': state,
		'alert': alertWarranted,
		'time': timeofCheck
	};

	var logString = JSON.stringify(logData);

	var logFileName = originalCheckData.id;

	_logs.append(logFileName, logString, function(err) {

			if(!err) {

				console.log("Logging to file succeeded");

			} else {

				console.log('Logging to file failed');
			}	
	});
};

workers.loop = function() {

	setInterval(function() {

		workers.gatherAllChecks();

	}, 1000 * 60);
};

workers.rotateLogs = function() {

	_logs.list(false,  function(err, logs) {

			if(!err && logs && logs.length > 0) {	

				logs.forEach(function(logName) {

					var logId = logName.replace('.log', '');
					var newFileId = logId+'-'+Date.now();
					_logs.compress(logId, newFileId, function(err) {

						if(!err) {

							_logs.truncate(logId, function(err) {

								if(!err) {

									console.log("Success truncating files");

								} else{

									console.log('Error truncating log file');
								}
							});

						} else {

							console.log('Error compressing one of the log files', err);
						}

					});
				});

			} else {

				console.log('Error: Could not find any logs to rotate');
			}
	});
};

workers.logRotationLoop = function() {

		setInterval(function () {

			workers.rotateLogs();
		}, 1000 * 60 * 60 *24)
};

workers.init = function() {

	workers.gatherAllChecks();

	workers.loop();

	workers.rotateLogs();

	workers.logRotationLoop();
};

module.exports = workers;