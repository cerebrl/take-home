/**
 * MongoDB config
 */

var mongoose = require('mongoose'),
	isConnected,
	config;

function init(env) {

	'use strict';

	if (!isConnected) {

		if (!config) {

			if (env === 'production') {

				config = {
					host: '127.0.0.1',
					port: 27017,
					user: '',
					password: '',
					database: 'take-home'
				};

			} else {

				config = {
					host: '127.0.0.1',
					port: 27017,
					user: '',
					password: '',
					database: 'take-home'
				};
			}
		}

		if (config.user) {

			// Connect to MongoDB with creds
			mongoose.connect('mongodb://' +
							 config.user + ':' +
							 config.password + '@' +
							 config.host + ':' +
							 config.port + '/' +
							 config.database);

		} else {

			// Connect to MongoDB without creds
			mongoose.connect('mongodb://' +
							 config.host + ':' +
							 config.port + '/' +
							 config.database);
		}

		// Test connection
		isConnected = mongoose.connection;
		isConnected.on('error', console.error.bind(console, 'connection error:'));
		isConnected.once('open', function callback () {
			console.log('Connected to MongoDB successfully.');
		});
	}

	return mongoose;
}

module.exports = init;