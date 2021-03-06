/**
 * Users Model
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Transactions;

var init = function () {

	'use strict';

	var transSchema = new Schema({

			date: {
				type: Date,
				default: new Date()
			},
			recipient: String,
			email: String,
			type: String,
			amount: String,
			currency: String,
			message: String,
			int: Number
		});

	Transactions = mongoose.model('transactions', transSchema);

	return Transactions;
};

module.exports = init();