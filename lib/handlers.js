var _data = require('./data');
var helpers = require('./helpers');
var config = require('../config');
var handlers = {};





handlers.index = function(data, callback) {

	if(data.method == 'get') {

		var templateData = {

			'head.title': 'Site - Monitor',
			'head.description': 'This is a meta description',
			'body.title': 'Hello templated world',
			'body.class': 'index'
		};

		helpers.getTemplate('index', templateData, function(err, str) {

			if(!err && str){

				helpers.addUniversalTemplates(str, templateData, function(err, str) {

					if(!err && str) {

						callback(200, str, 'html');
					} else {

						callback(500, undefined, 'html');
					}
				});

			} else {

				callback(500, undefined, 'html');
			}

		});

	} else {

		callback(405, undefined, 'html');
	}
};

handlers.accountCreate = function(data, callback) {

	if(data.method == 'get') {

		var templateData = {

			'head.title': 'Create an Account',
			'head.description': 'Signup is easy and only takes a few seconds',
			'body.class': 'accountCreate'
		};

		helpers.getTemplate('accountCreate', templateData, function(err, str) {

			helpers.addUniversalTemplates(str, templateData, function(err, data) {

					if(!err && data) {

						callback(200, data, 'html');

					} else {

						callback(500, undefined, 'html');
					}
			});

		});
	} else {

		callback('405', undefined, 'html');
	}
};


handlers.sessionCreate = function(data, callback) {

		if(data.method == 'get') {

		var templateData = {

			'head.title': 'Log into your Account',
			'head.description': 'Please enter your phone number and password to access your account',
			'body.class': 'accountCreate'
		};

		helpers.getTemplate('sessionCreate', templateData, function(err, str) {

			helpers.addUniversalTemplates(str, templateData, function(err, data) {

					if(!err && data) {

						callback(200, data, 'html');

					} else {

						callback(500, undefined, 'html');
					}
			});

		});
	} else {

		callback('405', undefined, 'html');
	}
};

handlers.accountEdit = function(data,callback){

	if(data.method == 'get'){

		var templateData = {
			'head.title' : 'Account Settings',
			'body.class' : 'accountEdit'
		};

		helpers.getTemplate('accountEdit',templateData,function(err,str){
			if(!err && str){

				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str){

						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};


handlers.sessionDeleted = function(data, callback){ 

	if(data.method == 'get'){

		var templateData = {
			'head.title' : 'Logged Out',
			'head.description' : 'You have been logged out of your account.',
			'body.class' : 'sessionDeleted'
		};

		helpers.getTemplate('sessionDeleted',templateData, function(err, str) {
			
			if(!err && str) {

				helpers.addUniversalTemplates(str,templateData,function(err, str) {
				 
				 	if(!err && str) {

						callback(200,str,'html');

					} else {

						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}

		});

	} else {
		 
		callback(405,undefined,'html');
	}
};


handlers.accountDeleted = function(data,callback){

	if(data.method == 'get'){

		var templateData = {
			'head.title' : 'Account Deleted',
			'head.description' : 'Your account has been deleted.',
			'body.class' : 'accountDeleted'
		};

		helpers.getTemplate('accountDeleted',templateData,function(err,str){
			if(!err && str){

				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str){

						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};


handlers.checksCreate = function(data,callback){

	if(data.method == 'get'){

		var templateData = {
			'head.title' : 'Create a New Check',
			'body.class' : 'checksCreate'
		};

		helpers.getTemplate('checksCreate',templateData,function(err,str){
			if(!err && str){

				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str){

						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};


handlers.checksList = function(data,callback){

	if(data.method == 'get'){

		var templateData = {
			'head.title' : 'Dashboard',
			'body.class' : 'checksList'
		};

		helpers.getTemplate('checksList',templateData,function(err,str){
			if(!err && str){

				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str){

						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};


handlers.checksEdit = function(data,callback){

	if(data.method == 'get'){

		var templateData = {
			'head.title' : 'Check Details',
			'body.class' : 'checksEdit'
		};

		helpers.getTemplate('checksEdit',templateData,function(err,str){
			if(!err && str){

				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str){

						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};

handlers.favicon = function(data, callback){

	if(data.method == 'get') {

		helpers.getStaticAsset('favicon.ico', function(err, data) {

			if(!err && data) {

				callback(200, data, 'favicon');

			} else {

				callback(500);
			}
		});

	} else {

		callback(405);
	}
};


handlers.public = function(data,callback){
  
  if(data.method == 'get'){
    
    var trimmedAsset = data.trimmedPath.replace('public/','');
     var trimmedAssetName = trimmedAsset.replace(/^\/+|\/+$/g, '');
    if(trimmedAssetName.length > 0){
      
      helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if( !err && data && data.length > 0){

          
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){

            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){

            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){

            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){

            contentType = 'favicon';
          }

          
          callback(200,data,contentType);
        } else {
          callback(404, {"Error": "File not found!"});
        }
      });
    } else {
      callback(404, {"Error": "File not found!"});
    }

  } else {
    callback(404, {"Error": "File not found!"});
  }
};




handlers.users = function(data, callback) {

	var acceptableMethods = ['post', 'get', 'put', 'delete'];

	if(acceptableMethods.indexOf(data.method) > -1) {

		handlers._users[data.method](data, callback);

	} else {

		callback(405);
	}

};

handlers._users = {};

handlers._users.post = function (data, callback) {

	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var phone =  typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
	var password =  typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;
	var tosAgreement =  typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;


	if(firstName && lastName && phone && password && tosAgreement) {

		_data.read('users', phone, function (err, data) {

				if(err) {

					var hashedPassword = helpers.hash(password);

					if(hashedPassword) {


						var userObject = {

							'firstName': firstName,
							'lastName': lastName,
							'phone': phone,
							'password': hashedPassword,
							'tosAgreement': tosAgreement
						};

						_data.create('users', phone, userObject, function(err) {

							if(!err) {

								callback(200);

							} else {

								callback(500, {'Error': 'Could not create the user'});
							}
						});
					} else {

						callback(500, {'Error': 'Could not hash the users password'});
					}

					

				} else {

					callback(400, {'Error': 'A user with that phone number already exists!'});
				}
		});

	} else {

		callback(400, {'Error': 'Missing Required Fields'});
	}
};

handlers._users.get = function (data, callback) {

	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone : false;
	if(phone) {

		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {

				if(tokenIsValid) {

					_data.read('users', phone, function (err, data) {

						if(!err && data) {

							delete data.password;
							callback(200, data);

						} else {

							callback(404);
						}
					});

				} else {

					callback(403, {'Error': 'Missing Required Token in header or invalid token'});
				}
		});

	} else {

		callback(400, {'Error': 'Missing Required Field'});
	}
};

handlers._users.put = function (data, callback) {

	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false;
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var password =  typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

	if(phone) {

		if(firstName || lastName || password) {

			var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

			handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {

				if(tokenIsValid) {

					_data.read('users', phone, function(err, userData) {

						if(!err && userData) {

							if(firstName) {
								userData.firstName = firstName;
							}

							if(lastName) {
								userData.lastName = lastName;
							}

							if(password) {

								userData.password = helpers.hash(password);
							}

							_data.update('users', phone, userData, function(err, data){

								if(!err) {

									callback(200);

								} else {
									console.log(err);
									callback(500, {'Error': 'Could not update the user'});
								}
							});

						} else {
							callback(400, {'Error': 'Specified user does not exist'});
						}
					});	

				} else {

					callback(403, {'Error': 'Missing Required Token in header or invalid token'});
				}

			});

		} else {

			callback(400, {'Error': 'Missing fields to update'});
		}

	} else {

		callback(400, {'Error': 'Missing Required Fields'});
	}
};	

handlers._users.delete = function (data, callback) {

	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone : false;
	
	if(phone) {

		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {

			if(tokenIsValid) {

				_data.read('users', phone, function(err, userData) {

					if(!err && data) {

						_data.delete('users', phone, function(err, data) {

							if(!err) {
								
								var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
								var checksToDelete = userChecks.length;

								if(checksToDelete > 0) {

									var checksDeleted = 0;
									var deletionErrors = false;

									userChecks.forEach(function (checkId) {

										_data.delete('checks', checkId, function(err) {

											if(err) {

												deletionErrors = true;

											} else {

												checksDeleted++;
												if(checksDeleted == checksToDelete) {

													if(!deletionErrors) {

														callback(200);

													} else {

														callback(500, {'Error': 'Unable to delete users check records!'});
													}
												}
											}

										});
									});

								} else {	

									callback(200);
								}

							} else {

								callback(500, {'Error': 'Could not delete the specified user'});
							}
						});

					} else {

						callback(400, {'Error': 'Could not find the specified user'});
					}
				});

			} else {

				callback(403, {'Error': 'Missing Required Token in header or invalid token'});	
			}

		});

	} else {

		callback(400, {'Error': 'Missing Required Fields'});
	}
};

handlers.tokens = function(data, callback) {

	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {

		handlers._tokens[data.method](data, callback);
	} else {

		callback(405);
	}
};

handlers._tokens = {};

handlers._tokens.post = function (data, callback) {

	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

	if (phone && password) {

		_data.read('users', phone, function(err, userData) {

			if(!err && userData) {

				var hashedPassword = helpers.hash(password);
				if(hashedPassword === userData.password) {

						var tokenId = helpers.createRandomString(20);

						var expires = Date.now() + 1000 * 60 * 60;

						var tokenObject = {

							'phone': phone,
							'id': tokenId,
							'expires': expires
						};

						_data.create('tokens', tokenId, tokenObject, function (err, data) {

								if(!err) {

									callback(200, tokenObject);

								} else {

									callback(500, {'Error': 'Could not create new token'});
								}

						});

				} else {
					callback(400, {'Error': 'Password did not match with the specified user password'});
				}

			} else {

				callback(400, {'Error': "User not found"});
			}

		});

	} else {
		callback(500, {'Error': "Missing Required Fields"});
	}

};

handlers._tokens.get = function (data, callback) {

	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

	if(id) {

		_data.read('tokens', id, function(err, data) {

			if(!err && data) {

				callback(200, data);

			} else {

				callback(400, {'Error': 'Token does not exist'});
			}
		});

	} else {

		callback(400, {'Error': 'Missing Required Fields'});
	}
};

handlers._tokens.put = function (data, callback) {

		var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
		var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true: false;

		if(id && extend) {

			_data.read('tokens', id, function(err, tokenData) {

				if(!err && tokenData) {

					if(tokenData.expires > Date.now()) {

						tokenData.expires = Date.now() + 1000*60*60;

						_data.update('tokens', id, tokenData, function(err) {

							if(!err) {

								callback(200);

							} else {

								callback(500, {'Error': 'Could not update token expiration'});
							}	

						});

					} else {

						callback(400, {'Error': 'The token has already expired'});
					}

				} else {

					callback(400, {'Error': "Specified token not found"});
				}	

			});

		} else {

			callback(400, {'Error': 'Missing Required fields'});
		}
};

handlers._tokens.delete = function (data, callback) {

	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

	if(id) {

		_data.read('tokens', id, function (err, data) {

			if(!err && data) {	

				_data.delete('tokens', id, function(err) {

					if(!err) {

						callback(200);

					} else {

						callback(500, {'Error': 'Could not delete user token'});
					}
				});

			} else {
				callback(400, {'Error': 'Could not find the specified token'});
			}
		});

	} else {

		callback(400, {'Error': 'Missing Required Fields'});
	}
};

handlers._tokens.verifyToken = function(id, phone, callback) {

	_data.read('tokens', id, function(err, tokenData) {

		if(!err && tokenData) {

			if(tokenData.phone === phone && tokenData.expires > Date.now()) {

				callback(true);

			} else {

				callback(false);
			}

		} else {

			callback(false);
		}
	});
};

handlers.checks = function(data, callback) {

	var acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {

		handlers._checks[data.method](data, callback);
	} else {

		callback(405);
	}
};

handlers._checks = {};

handlers._checks.post = function(data, callback) {

	var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
	var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

	if(protocol && url && method && successCodes && timeoutSeconds) {

			var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

			_data.read('tokens', token, function (err, tokenData) {

				if(!err && tokenData) {

					var userPhone = tokenData.phone;

					_data.read('users', userPhone, function(err, userData) {

						if(!err && userData) {

							var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
							var maxChecks = typeof(config.maxChecks) !== 'undefined' ? config.maxChecks : 5;

							if(userChecks.length < maxChecks) {

								var checkId = helpers.createRandomString(20);

								var checkObject = {

									'id': checkId,
									'userPhone': userPhone,
									'protocol': protocol,
									'url': url,
									'method': method,
									'successCodes': successCodes,
									'timeoutSeconds': timeoutSeconds,
								};

								_data.create('checks', checkId, checkObject, function (err) {

									if(!err) {

										userData.checks = userChecks;
										userData.checks.push(checkId); 

										_data.update('users', userPhone, userData, function (err) {

											if(!err) {

												callback(200, checkObject);

											} else {

												callback(500, {'Error': 'Something went wrong, could not create check object in user data'});
											}

										});

									} else {

										callback(500, {'Error': 'Could not create the new Check'});
									}

								});

							} else {

								callback(400, {'Error': 'The user already has the max number of checks allowed: 5'});
							}


						} else {

							callback(403);
						}

					});

				} else {

					callback(403, {'Error': 'Invalid token provided'});
				}
			});

	} else {

		callback(400, {'Error': 'Missing Required Fields'});
	}
};

handlers._checks.get = function(data, callback) {

	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

	if(id) {

		_data.read('checks', id, function(err, checkData) {

			if(!err && checkData) {

				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {

					if(tokenIsValid) {

						callback(200, checkData);

					} else {

						callback(403, {'Error': 'Token and user mismatch!'});

					}

				});

			} else {

			}

		});


	} else {

		callback(400, {'Error': 'Invalid check id provided'});
	}
};

handlers._checks.put = function(data, callback) {

	var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
	var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
	var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

	if(id) {

		if(id || protocol || url || method || successCodes || timeoutSeconds) {

				_data.read('checks', id, function(err, checkData) {

					if(!err && checkData) {


						var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

						handlers._tokens.verifyToken(token, checkData.userPhone, function(isTokenValid) {

							if(isTokenValid) {

								if(protocol) {

									checkData.protocol = protocol;
								}


								if(url) {

									checkData.url = url;
								}


								if(method) {

									checkData.method = method;
								}


								if(successCodes) {

									checkData.successCodes = successCodes;
								}

								if(timeoutSeconds) {

									checkData.timeoutSeconds = timeoutSeconds;
								}

								_data.update('checks', id, checkData, function (err) {

										if(!err) {

											callback(200);

										} else {	

											callback(500, {'Error': 'Unable to update Check information'});
										}
								});

							} else {

								callback(400, {'Error': "The token is either expired or is invalid"});

							}
						});

					} else {

						callback(400, {'Error': "The check id specified is invalid or missing"});
					}
				});

		} else {

			callback(400, {'Error' : "Missing Required Fields to update"});
		}

	} else {

		callback(400, {'Error': "Missing Required Fields"});
	}
};

handlers._checks.delete = function(data, callback) {

	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;	

	_data.read('checks', id, function(err, checkData) {

			if(!err && checkData) {

				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {

					if(tokenIsValid) {

						_data.delete('checks', id, function(err) {

							if(!err) {	

								_data.read('users', checkData.userPhone, function(err, userData) {

										if(!err && userData) {

											var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
											var checkPosition = userChecks.indexOf(id);

											if(checkPosition > -1) {

												userChecks.splice(checkPosition, 1);

												_data.update('users', checkData.userPhone, userData, function(err) {

														if(!err) {

															callback(200);

														} else {

															callback(500, {'Error': 'Could not update users check information'});
														}
												});

											} else{

												callback(500, {'Error': "Check not found in the user's data"});
											}

										} else {

											callback(500, {'Error': "Could not find the check's owner"});
										}
								});

							} else {

								callback(500, {'Error': 'The check could not be deleted'});
							}

						});

					} else {

						callback(400, {"Error": "The token is either invalid or has expired"});
					}

				});

			} else {

				callback(400, {'Error': 'Invalid or missing required fields'});
			}
	});
};

handlers.ping = function(data, callback) {

	callback(200);
};

handlers.notFound = function (data, callback) {

	callback(404);
};

module.exports = handlers;