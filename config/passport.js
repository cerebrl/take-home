var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Users = require('../middle-end/models/mdl-users');

var init = function () {

	'use strict';

	// Passport session setup.
	// To support persistent login sessions, Passport needs to be able to
	// serialize users into and deserialize users out of the session. Typically,
	// this will be as simple as storing the user ID when serializing, and finding
	// the user by ID when deserializing.
	passport.serializeUser(function(user, done) {

		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {

		Users.findOne({_id: id}, function (err, user) {

			done(err, user);
		});
	});

	// Use the LocalStrategy within Passport.
	// Strategies in passport require a `verify` function, which accept
	// credentials (in this case, a username and password), and invoke a callback
	// with a user object.
	passport.use(new LocalStrategy({

			usernameField: 'email',
			passwordField: 'password'

		}, function(email, password, done) {

			Users.findOne({ email: email }, function(err, user) {

				user = new Users(user);

				if (err) { return done(err); }

				if (!user) { return done(null, false, { message: 'Incorrect username.' }); }

				if (!user.validPassword(password)) {

					return done(null, false, { message: 'Incorrect password.' });
				}

				return done(null, user);
			});
		}));
};

module.exports = init;