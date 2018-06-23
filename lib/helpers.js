var helpers = {};
var crypto = require('crypto');
var config = require('../config');
var https = require('https');
var queryString = require('querystring');
var path = require('path');
var fs = require('fs');

//return console.log(process.env);
//return console.log(config);
//return console.log(config.environmentToExport.httpport);
//return console.log(path.join(__dirname, '/../public/'));

helpers.hash = function (str) {

	if(typeof(str) == 'string' && str.length > 0) {

		var hashingSecret = typeof(config.hashingSecret) == 'undefined' ? 'thisIsASecret' : config.hashingSecret;

		var hash = crypto.createHmac('sha256', hashingSecret).update(str).digest('hex');
		return hash;
	} else {

		return false;
	}
};

helpers.parseJsonToObject = function (buffer) {

		try {

			var obj = JSON.parse(buffer);
			return obj;

		} catch (e) {

			return {};
		}
};

helpers.createRandomString = function (strlength) {

	strlength = typeof(strlength) == 'number' && strlength > 0 ? strlength : false;
	if(strlength) {

		var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

		var str = '';
		for (i = 1; i <= strlength; i++) {

			var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));


			str += randomCharacter;
		}

		return str;

	} else {	

		return false;
	}
 
};

helpers.sendTwilioSms = function(phone, msg, callback) {

	var phone = typeof(phone) == 'string' && phone.trim().length === 10 ? phone.trim() : false;
	var msg = typeof(msg) == 'string' && msg.trim().length <= 1600 ? msg.trim() : false;


	var fromPhone = '15005550006';

	if(phone && msg) {

		var payload = {

			'From': fromPhone,
			'To': '+91'+phone,
			'Body': msg
		};

		var accountSid = 'ACb32d411ad7fe886aac54c665d25e5c5d';
		var authToken = '9455e3eb3109edc12e3d8c92768f7a67';

		var stringPayload = queryString.stringify(payload);

		var requestDetails = {

			'protocol': 'https:',
			'hostname': 'api.twilio.com',
			'method': 'POST',
			'path': '/2010-04-01/Accounts/'+accountSid+'/Messages.json',
			'auth': accountSid+':'+authToken,
			'headers': {

				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(stringPayload),
			}
		}

		var req = https.request(requestDetails, function (res) {

				var status = res.statusCode;
				if(status == 200 || status == 201){

					callback(false);
				} else {

					callback('Status Code returned was'+status);
				}
		});

		req.on('error', function(e){

			callback(e);
		});

		req.write(stringPayload);

		req.end();

	} else {

		callback('Given parmeters were missing or invalid');
	}

};

helpers.getTemplate = function(templateName, data, callback) {

	templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
	data = typeof(data) == 'object' && data !== null ? data : null;
	if(templateName) {	

		var templatesDir = path.join(__dirname, '/../templates/');
		fs.readFile(templatesDir+templateName+'.html', 'utf8', function(err, str) {

			if(!err && str && str.length > 0) {

				var finalString = helpers.interpolate(str, data);
				callback(false, finalString);

			} else {

				callback('No templates could be found');
			}

		});

	} else {

		callback('A valid template name was not defined');
	}

};

helpers.addUniversalTemplates = function(str, data, callback){
		
		str = typeof(str) == 'string' && str.length > 0 ? str : false;
		data = typeof(data) == 'object' && data !== null ? data : {};

		helpers.getTemplate('_header', data, function(err, headerString) {

			if(!err && headerString) {

				helpers.getTemplate('_footer', data, function(err, footerString) {

						if(!err && footerString) {

							var fullString = headerString+str+footerString;
							callback(false, fullString);

						} else {

							callback('Could not find the footer template');
						}
				});

			} else {

				callback('Could not find the header template');
			}
		});

}

helpers.interpolate = function(str, data) {

	str = typeof(str) == 'string' && str.length > 0 ? str : false;
	data = typeof(data) == 'object' && data !== null ? data : {};

	for(var keyName in config.templateGlobals) {

		if(config.templateGlobals.hasOwnProperty(keyName)) {
			data['global.'+keyName] = config.templateGlobals[keyName];
		}
	}

	for(var key in data) {

		if(data.hasOwnProperty(key) && typeof(key) == 'string' ) {

			var replace = data[key];
			var find = '{'+key+'}';
			str = str.replace(find,replace);
		}
	}

	return str;
}

helpers.getStaticAsset = function(fileName,callback){
  
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;

  if(fileName){
  
    var publicDir = path.join(__dirname,'/../public/');
  
    fs.readFile(publicDir+fileName, function(err,data){
  
      if(!err && data){
  
        callback(false,data);
  
      } else {
  
        callback('No file could be found');
  
      }
  
    });
  
  } else {
  
    callback('A valid file name was not specified');
  
  }

};

module.exports = helpers;