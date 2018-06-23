var environments = {};

environments.development = {

	'httpport': 3000,
	'httpsport': 3001,
	'envName': 'development',
	'hashingSecret': 'thisIsASecret',
	'maxChecks': 5,
	'twilio' : {

	    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
	    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
	    'fromPhone' : '+15005550006'
 	 },

 	 'templateGlobals': {

 	 	'appName': 'SiteChecker',
 	 	'companyName': 'theBatbrand',
 	 	'yearCreated': '2018',
 	 	'baseUrl': 'http://localhost:3000/'	 	
 	 }
};

environments.productions = {

	'httpport': 5000,
	'httpsport': 5001,
	'envName': 'production',
	'hashingSecret': 'thisIsASecret',
	'maxChecks': 5,
	'twilio' : {

	    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
	    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
	    'fromPhone' : '+15005550006'
	  },

	'templateGlobals': {

	  	'appName': 'SiteChecker',
	  	'companyName': 'theBatbrand',
	  	'yearCreated': '2018',
	  	'baseUrl': 'http://localhost:3000/'	 	
	  }
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
console.log(process.env.NODE_ENV);

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


module.exports = environmentToExport;
