/**
 * Send Money Controller
 */

var init = function () {

	'use strict';

	return {

		index: function (req, res) {

			res.render('send/index', {
				title: 'Send Money | PayPal',
				user:  req.user.toObject()
			});
		},
		create: function (req, res) {

			setTimeout(function () {
				res.json({
					type: 'send',
					amount: req.body.amount,
					currency: req.body.currency,
					to: req.body.to
				});
			}, 2000);
		}
	};
};

module.exports = init();