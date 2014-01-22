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
				res.json(200);
			}, 10000);
		}
	};
};

module.exports = init();