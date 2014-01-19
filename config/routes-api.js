var fs = require('fs'),
	ctrlrPath = '../middle-end/controllers/',
	users = require(ctrlrPath + 'ctrlr-users');

module.exports = function (app) {

	'use strict';

	// app.get('/api/users/:id', users.user);
	app.post('/api/users', users.create);
	app.put('/api/users/:id', users.update);
	app.delete('/api/users/:id', users.destroy);
};