/**
 * Users Controller
 */

var crypto = require('crypto'),
	users = require('../models/mdl-users');

var init = function () {

	'use strict';

	return {

		index: function(req, res) {

			var currentUser = req.user || {};

			var data = {
					users: [],
					loggedInUser:  currentUser.email,
					facebookauth: currentUser.facebookid,
					title: "Users"
				};

			users.find({}, function(err, users) {

					if (!err) {
						data.users = users;
					}

					res.render('users/index', data);
				});
		},

		user: function(req, res) {

			users.findById(req.params.id, function(err, user) {

					res.render('users/edit', {

						id: user.id,
						email: user.email,
						loggedInUser:  req.user.email,
						facebookauth: req.user.facebookid,
						title: "Edit User"
					});
				});
		},

		update: function(req, res) {

			var data = {
					email: req.body.email,
					password: req.body.password
				},
				salt =  Math.round((new Date().valueOf() * Math.random())) + '',
				hashedPassword = crypto.createHmac('sha1', salt).
						update(data.password).
						digest('hex');

			data.salt = salt;
			data.password = hashedPassword;

			users.findByIdAndUpdate(req.params.id, data, function(err, user) {

					res.redirect('/admin/users');
				});
		},

		create: function(req, res) {

			var email = req.body.email,
				password = req.body.password,
				salt =  Math.round((new Date().valueOf() * Math.random())) + '',
				hashedPassword = crypto.createHmac('sha1', salt).
						update(password).digest('hex');

			users.create({

					email: email,
					password: hashedPassword,
					salt: salt

				}, function(err, user) {

					res.redirect('/admin/users');
				});
		},

		destroy: function(req, res) {

			users.findByIdAndRemove(req.params.id, function(err, user) {

					res.redirect('/admin/users');
				});
		}
	};
};

module.exports = init();