/**
 * Transactions Controller
 */
var Transactions = require('../models/mdl-trans.js');

var init = function () {

	'use strict';

	return {

		index: function (req, res) {

			var collection = {
					data: [],
					type: 'transactions',
					next: 0,
					limit: 20
				};

			Transactions.count().exec(function (err, count) {

				collection.next = count;
				collection.total = count;

				Transactions.find({}).
					sort({ int: -1 }).
					limit(collection.limit).
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

			var collection = {
					data: [],
					type: 'transactions',
					limit: 20
				};

			if (req.query.next) {

				collection.next = parseInt(req.query.next, 10);

				Transactions.find({}).
					where('int').lt(collection.next).gte(collection.next - collection.limit).
					sort({ int: -1 }).
					limit(20).
					exec(function (err, transactions) {

						collection.data = transactions;
						collection.next = collection.next - 20;

						res.json(collection);
					});

			} else if (req.query.previous) {

				collection.previous = parseInt(req.query.previous, 10);

				Transactions.find({}).
					where('int').
					lte(collection.previous + collection.limit).
					sort({ int: -1 }).
					limit(20).
					exec(function (err, transactions) {

						collection.data = transactions;
						collection.previous = collection.previous + 20;

						res.json(collection);
					});
			}
		},
		instance: function (req, res) {

			Transactions.findById(req.params.id, function (err, transaction) {

				res.json(transaction);
			});
		}
	};
};

module.exports = init();