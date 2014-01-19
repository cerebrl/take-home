// Really want to get testing started for routes, but having difficulties
// here's a link to something substantial https://github.com/hunterloftis/component-test/blob/master/lib/users/test/controller.test.js

var request = require('supertest'),
	app = require('../app');

describe('GET /users', function () {

	'use strict';

	it('respond with json', function (done) {
		request(app).
				get('/login').
				end(function (err, res) {

					expect(res.req._header.indexOf('login')).not.toEqual(-1);

					if (err) {
						return done(err);
					}
					done();
				});
	});
});