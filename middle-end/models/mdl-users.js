/**
 * Users Model
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	Users;

var init = function () {

	'use strict';

	var userSchema = new Schema({

			email: String,
			password: String,
			salt: Number,
			facebookid: String
		});

	userSchema.methods.validPassword = function (password) {

		var hashedPassword = crypto.
				createHmac('sha1', this.salt.toString()).
				update(password).
				digest('hex');

		return this.password === hashedPassword;
	};

	Users = mongoose.model('Users', userSchema);

	return Users;
};

module.exports = init();