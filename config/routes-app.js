/**
 * This is the Routes script that runs the URL scheme.
 *
 * Grab controller to use methods
 */

var fs = require('fs'),
	ctrlrPath = '../middle-end/controllers/',
	auth = require(ctrlrPath + 'ctrlr-auth'),
	send = require(ctrlrPath + 'ctrlr-send'),
	transactions = require(ctrlrPath + 'ctrlr-trans'),
	users = require(ctrlrPath + 'ctrlr-users');

module.exports = function (app, passport) {

	'use strict';


	/******************
	 * UNAUTHENTICATED ROUTES
	 */

	app.get('/', auth.login);

	app.post('/login',

		passport.authenticate('local', {
			failureRedirect: '/login',
			failureFlash: 'Invalid username or password.'
		}),

		auth.loginaction);

	app.get('/logout', auth.logout);


	/***********************
	 * Simple route middleware to ensure user is authenticated.
	 * Use this route middleware on any resource that needs to be protected.  If
	 * the request is authenticated (typically via a persistent login session),
	 * the request will proceed.  Otherwise, the user will be redirected to the
	 * login page.
	 */

	function ensureAuthentication(req, res, next) {

		if (req.isAuthenticated()) {

			return next();
		}

		res.redirect('/');
	}


	/******************
	 * AUTHENTICATION MIDDLEWARE
	 */

	// This is a catch all and pass through (aka "middleware") *if* auth is successful
	app.all('*', ensureAuthentication);


	/******************
	 * MAIN ROUTES
	 */

	app.get('/mobile', auth.home);
	app.get('/mobile/send-money', send.index);
	app.get('/mobile/transactions', transactions.index);


	/******************
	 * USER
	 */

	app.get('/mobile/users', users.index);
	app.get('/mobile/users/:id', users.user);
	app.post('/mobile/users', users.create);
	app.get('/mobile/users/:id/delete', users.destroy);
};