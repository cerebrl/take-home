
/**
 * This is the main JS script that runs the server.
 *
 * Require core modules
 * Instantiate the Express server
 * Require the config for Express
 * Require the config for Routes
 * Start the servers
 */

var Express = require('express'),
	http = require('http'),
	passport = require('passport'),
	env = process.env.NODE_ENV || 'development',
	port = process.env.PORT || 5000;

// Create a new instance of Express
var app = new Express();

// Create MongoDB connection
var mongoose = require('./config/mongo')(env);

// Configure Express settings
require('./config/express')(app, passport, mongoose);

// Configure Route settings
// require('./config/routes-site')(app);

// Configure Authentication
require('./config/passport')(app, passport);

// Configure Route settings
require('./config/routes-app')(app, passport);

// Configure Route settings
require('./config/routes-api')(app);

// Create server and listen on port given
http.createServer(app).listen(port, function () {

	'use strict';

	console.log("Express listening on port " + port + ' within a ' + env + ' environment.');
});
