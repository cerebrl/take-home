var fs = require('fs'),
	ctrlrPath = '../middle-end/controllers/',
	send = require(ctrlrPath + 'ctrlr-send'),
	transactions = require(ctrlrPath + 'ctrlr-trans'),
	users = require(ctrlrPath + 'ctrlr-users');

module.exports = function (app) {

	'use strict';

	// Send money
	app.post('/api/send', send.create);

	// Transactions
	app.get('/api/transactions/:id', transactions.instance);
	app.post('/api/transactions', transactions.create);

	app.post('/api/users', users.create);
	app.put('/api/users/:id', users.update);
	app.delete('/api/users/:id', users.destroy);
};