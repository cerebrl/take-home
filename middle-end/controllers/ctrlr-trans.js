/**
 * Transactions Controller
 */
var Transactions = require('../models/mdl-trans.js');

var init = function () {

	'use strict';

	return {

		index: function (req, res) {

			Transactions.find({}, function (err, transactions) {

				res.render('transactions/index', {
					title: 'Transaction History | PayPal',
					user:  req.user.toObject(),
					transactions: JSON.stringify(transactions)
				});
			});
		},
		create: function (req, res) {

			Transactions.count({}, function (err, count) {

				req.body.int = count;

				Transactions.create(req.body, function (err, transaction) {

					res.json({id: transaction._id});
				});
			});
		},
		collection: function (req, res) {

			Transactions.find({}, function (err, transactions) {

				res.json(transactions);
			});
		},
		instance: function (req, res) {

			Transactions.findById(req.params.id, function (err, transaction) {

				res.json(transaction);
			});
		}
	};
};

module.exports = init();