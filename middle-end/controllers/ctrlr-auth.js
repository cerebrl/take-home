/**
 * AuthController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var passport = require('passport');

var init = function () {

	'use strict';

	return {

		home: function (req, res) {

			res.render('home', {
				title: "Home | PayPal",
				user:  req.user.toObject(),
				balance: '$300.00'
			});
		},

		login: function (req, res) {

			if (req.user) {

				res.redirect('/home');

			} else {

				res.render('login', {
						title: 'Login',
						user: null
					});
			}
		},

		loginaction: function (req, res) {

			res.redirect('/home');
		},

		logout: function (req,res) {

			req.logout();
			res.redirect('/');
		}

	};
};

module.exports = init();