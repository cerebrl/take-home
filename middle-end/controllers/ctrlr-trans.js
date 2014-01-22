/**
 * Transactions Controller
 */
var Transactions = require('../models/mdl-trans.js');

var init = function () {

	'use strict';

	var collection = {
			data: [],
			type: 'transactions',
			next: 0,
			limit: 10
		};

	return {

		index: function (req, res) {

			Transactions.count().exec(function (err, count) {

				collection.next = count;
				collection.total = count;

				Transactions.find({}).
					sort({ int: -1 }).
					limit(collection.limit + 60).
					exec(function (err, transactions) {

							collection.data = JSON.stringify(transactions);

							res.render('transactions/index', {
								title: 'Transaction History | PayPal',
								user:  req.user.toObject(),
								collection: collection
							});
						});
			});
		},
		create: function (req, res) {

			// Debits are negative, so make it so!
			req.body.amount = req.body.amount * -1;

			Transactions.count({}, function (err, count) {

				req.body.int = count;

				Transactions.create(req.body, function (err, transaction) {

					res.json({id: transaction._id});
				});
			});
		},
		collection: function (req, res) {

			collection.next = parseInt(req.query.next, 10);

			Transactions.find({}).
				where('int').
				lt(collection.next).gte(collection.next - collection.limit).
				sort({ int: -1 }).
				limit(collection.limit).
				exec(function (err, transactions) {

					collection.data = transactions;
					collection.next = collection.next - collection.limit;

					res.json(collection);
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