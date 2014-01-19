/**
* This is the Express config script.
 *
 * this is a test.
*
* Require needed modules
* Set localization
* Set view engine
* Configure global settings
* Set security settings
* Set route module
* Set fall through for 404
* Set environment specific settings
*
* NOTE: For all the security things included below, including the absence of bodyParser()
* see this url below for my collection of security measures for Express:
*
*/


var express = require('express'),
	fs = require('fs'),
    mongoStore = require('connect-mongo')(express),
	flash = require('connect-flash'),
	path = require('path'),
	root = path.normalize(__dirname + '/..');

module.exports = function (app, passport, db) {

	'use strict';

	// Gzip everything
	app.use(express.compress());

	// Create a writable stream to the log file
	// This is used below in express.log()
	var logStream = fs.createWriteStream(__dirname + '/../logs/middle-end.log', {'flags': 'a'});

	/**********************************
	 * GLOBAL CONFIGURATIONS
	 */


	// VIEW ENGINE
	// Set ejs as our view engine
	app.set('view engine', 'ejs');

	// Use flash to provide login messages
	app.use(flash());

	// Use this instead of express.bodyParser(), which is not secure
	// If .multipart() is needed, use it explicitly where needed
	app.use(express.json());
	app.use(express.urlencoded());

	// Set views base path and engine
	app.set('views', root + '/middle-end/views');
	app.set('view engine', 'ejs');

	app.use(express.favicon());

	app.use(express.logger({
		stream: logStream,
		format: 'dev'
	}));

	// This is mostly not needed, but it allows for more
	// of the HTTP verbs, rather than just GET and POST with
	// traditional form actions.
	app.use(express.methodOverride());


	app.configure('development', function () {

		// our exposed folder root is located at public/dev in development
		app.use(express.static(path.join(root, '_public/dev')));

		// Cookie parser should be above session
		app.use(express.cookieParser());

		// Create Express session
		app.use(express.session({
				secret: 'b37200717a2a57fd187f9b2ba88efe6a',
				store: new mongoStore({
					db: db.connection.db,
					collection: 'sessions'
				}),
				cookie: {
					httpOnly: true,
					secure: false
				}
			}));
	});

	app.configure('production', function () {

		// our exposed folder root is located at public/dev in development
		app.use(express.static(path.join(root, '_public/dist')));

		// Cookie parser should be above session
		app.use(express.cookieParser());

		// Create Express session
		app.use(express.session({
				secret: 'b37200717a2a57fd187f9b2ba88efe6a',
				store: new mongoStore({
					db: db.connection.db,
					collection: 'sessions'
				}),
				cookie: {
					httpOnly: true,
					secure: false
				}
			}
		));
	});


	// Use passport session
	app.use(passport.initialize());
	app.use(passport.session());


	/**********************************
	 * CONFIGURATION FOR DEVELOPMENT ENVIRONMENT
	 */

	app.configure('development', function () {

		console.log(path.join(root, '_public/dev'));

		// Error handler
		app.use(express.errorHandler());
	});

	/**********************************
	 * CONFIGURATION FOR TESTING ENVIRONMENT
	 */

	app.configure('testing', function () {

		console.log(path.join(root, '_public/dist'));

		// Error handler
		app.use(express.errorHandler());
	});


	/**********************************
	 * CONFIGURATION FOR PRODUCTION ENVIRONMENT
	 */

	app.configure('production', function () {

		console.log(path.join(root, '_public/dist'));
	});

	/**********************************
	 * CONFIGURATION FOR ROUTING ENVIRONMENT
	 */

	// Handle all proper routing
	app.use(app.router);

	// Assume "not found" in the error msgs is a 404.
	app.use(function(err, req, res, next) {

		// Treat as 404 if "not found" is in the message
		if (err.message.indexOf('not found') !== -1) {

			// Calls the next app.use method below
			return next();
		}

		// If the condition returns false from above,
		// It must be a server error, so log it!
		console.error(err.stack);

		// Render 500 error page
		res.status(500).render('500', {
			title: "Server error: something seems to have gone wrong.",
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded above
	app.use(function(req, res, next) {

		// Render 404 error page
		res.status(404).render('404', {
			title: "404 Error: this page is not found.",
			url: req.originalUrl
		});
	});
};
