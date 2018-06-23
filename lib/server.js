var http = require('http');
var https = require('https');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var _data = require('./data');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');

var server = {};

server.httpServer = http.createServer(function(req, res) {

	server.unifiedServer(req, res);

});


server.httpsServerOptions = {

	'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	'cert': fs.readFileSync(path.join(__dirname, '/../https/csr.pem'))
}

server.httpsServer = https.createServer(server.httpsServerOptions,function(req, res) {

	server.unifiedServer(req, res);

});



server.unifiedServer = function(req, res) {

	var parsedUrl = url.parse(req.url, true);
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	var queryStringObject = parsedUrl.query;

	var headers = req.headers;

	var decoder = new stringDecoder('utf-8');

	var method = req.method.toLowerCase();
	var buffer = '';

	req.on('data', function(data) {

		buffer += decoder.write(data);
	});

	req.on('end', function () {

		buffer += decoder.end();

		var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
		chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

		var data = {

			'trimmedPath': trimmedPath,
			'queryStringObject': queryStringObject,
			'method': method,
			'headers': headers,
			'payload': helpers.parseJsonToObject(buffer)
		};

		chosenHandler(data, function(statusCode, payload, contentType) {

			contentType = typeof(contentType) == 'string' ? contentType : 'json';

			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			var payloadString = '';
			if(contentType == 'json') {

				res.setHeader('Content-Type', 'application/json');
				payload = typeof(payload) == 'object' ? payload : {};
				payloadString = JSON.stringify(payload);
			} 


			if(contentType == 'html') {

				res.setHeader('Content-Type', 'text/html');
				payloadString = typeof(payload) == 'string' ? payload : '';
			}

			if(contentType == 'favicon') {

				res.setHeader('Content-Type', 'image/x-icon');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'css') {

				res.setHeader('Content-Type', 'text/css');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'png') {

				res.setHeader('Content-Type', 'image/png');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'jpeg') {

				res.setHeader('Content-Type', 'image/jpeg');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'plain') {

				res.setHeader('Content-Type', 'text/plain');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}


			res.writeHead(statusCode);
			res.end(payloadString);

			console.log('Returning the response', statusCode, payloadString);
		});

	});
}





server.router = {

	'' : handlers.index,
	'account/create': handlers.accountCreate,
	'account/edit': handlers.accountEdit,
	'account/deleted': handlers.accountDeleted,
	'session/create': handlers.sessionCreate,
	'session/deleted': handlers.sessionDeleted,
	'checks/all': handlers.checksList,
	'checks/create': handlers.checksCreate,
	'checks/edit': handlers.checksEdit,
	'ping' : handlers.ping,
	'api/users': handlers.users,
	'api/tokens': handlers.tokens,
	'api/checks': handlers.checks,
	'favicon.ico': handlers.favicon,
	'public': handlers.public
};

server.init = function () {

	server.httpServer.listen(3000, function () {

		console.log("Server running on port 3000");
	});

	server.httpsServer.listen(3001, function () {

		console.log('Server running on port 3001');
	});
};

module.exports = server;