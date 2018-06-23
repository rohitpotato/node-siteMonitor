var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

var lib = {};

var baseDir = path.join(__dirname, '../.data/');
console.log(baseDir);

lib.create = function(dir, file, data, callback) {

	fs.open(baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor) {

		if(!err && fileDescriptor) {

			var stringData = JSON.stringify(data);

			fs.writeFile(fileDescriptor, stringData, function(err) {

					if(!err) {

						fs.close(fileDescriptor, function(err) {

							if(!err) {

								callback(false);

							} else {
								callback('Error closing new file');
							}
						});
					} else {

						callback('Error writting to new file');
					}
			});

		} else {
			callback('Could not create file, It may already exist');
		}
	});
};

lib.read = function (dir, file, callback) {

	fs.readFile(baseDir+dir+'/'+file+'.json', 'utf8', function(err, data) {
		
		if(!err && data) {

			var parsedData = helpers.parseJsonToObject(data);
			callback(false, parsedData);

		} else {

			callback(err, data);
		}
	});
};

lib.update = function (dir, file, data, callback) {

		fs.open(baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor) {

			if(!err && fileDescriptor) {

				var stringData = JSON.stringify(data);

				fs.truncate(fileDescriptor, function(err) {

					if(!err) {

						fs.writeFile(fileDescriptor, stringData, function(err) {

							if (!err) {

								fs.close(fileDescriptor, function (err) {

									if(!err) {

										callback(false);

									} else {
										callback('Error closing the file');
									}	
								});

							} else {

								callback('Error wrriting to existing file');
							}
						});

					} else {

						callback("Error truncating file");
					}
				});

			} else {

				callback('Could not open file for updating, It may not exist at the moment');
			}
		});
};

lib.delete = function(dir, file, callback) {

	fs.unlink(baseDir+dir+'/'+file+'.json', function (err) {

			if(!err) {

				callback(false);

			} else {

				callback('Error deleting File!!');
			}
	});

};	

lib.list = function(dir, callback) {

	fs.readdir(baseDir+dir+'/', function(err, data) {

		if(!err && data && data.length > 0) {

			var trimmedFileNames = [];
			data.forEach(function (filename) {

				trimmedFileNames.push(filename.replace('.json', ''));
			});

			callback(false, trimmedFileNames);

		} else {

			callback(err, data);
		}

	});
};

module.exports = lib;