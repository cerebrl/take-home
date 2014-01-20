/**
 * Authorization Controller
 */

var init = function () {

	'use strict';

	return {

		home: function (req, res) {

			res.render('home', {
				title: 'Home | PayPal',
				user:  req.user.toObject(),
				balance: '$300.00'
			});
		},

		login: function (req, res) {

			if (req.user) {

				res.redirect('/mobile');

			} else {

				res.render('login', {
						title: 'Login | PayPal',
						user: null
					});
			}
		},

		loginaction: function (req, res) {

			res.redirect('/mobile');
		},

		logout: function (req,res) {

			req.logout();
			res.redirect('/');
		}

	};
};

module.exports = init();