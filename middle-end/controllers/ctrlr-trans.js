/**
 * Transactions Controller
 */
var Transactions = require('../models/mdl-trans.js');

var init = function () {

	'use strict';

	var type = 'transactions',
		limit = 20,
		total;

	return {

		index: function (req, res) {

			// First, count how many items in DB
			Transactions.count().exec(function (err, count) {

				var next = count,
					initialLoad = 80;

				total = count;

				// Now grab first group of items
				Transactions.find({}). // All items
					sort({ int: -1 }). // Sort in reverse count
					limit(initialLoad). // Limit to initial load limit
					exec(function (err, transactions) {

							var data = JSON.stringify(transactions);

							res.render('transactions/index', {
								title: 'Transaction History | PayPal',
								user:  req.user.toObject(),
								collection: {
									type: type,
									next: next - initialLoad,
									limit: limit,
									total: total,
									data: data
								}
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

			var next = parseInt(req.query.next, 10);

			// Grab more items within parameters
			Transactions.find({}). // All items
				where('int').lt(next).gte(next - limit). // Creates range
				sort({ int: -1 }). // Sorts items
				limit(limit). // Limits return
				exec(function (err, transactions) {

					var data = transactions;

					res.json({
							type: type,
							next: next - limit,
							limit: limit,
							total: total,
							data: data
						});
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