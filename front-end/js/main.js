(function () {

	'use strict';

	/************************************************************
	 * Load Javascripts Asynchronously **************************
	 ************************************************************/

	// Create global var for attaching PHI modules.
	window.PHI = {};
	requirejs.config({

		// Map out all "modules" to paths
		paths: {

			// Bower dependencies
			'jquery': '/vendor-bower/jquery/jquery.min',
			'showdown': '/vendor-bower/showdown/compressed/showdown',

			// UI/Ix jQuery framework
			'overlay': '/phi/framework/components/overlay/overlay',
			'alerts': '/phi/framework/components/alerts/alerts',

			// Phi's Angular Directives
			'common-inputs': '/phi/framework/directives/dir-common-components'
		},

		// Declare all dependencies
		shim: {
			'overlay': ['jquery'],
			'alerts': ['jquery']
		}
	});

	// Load in js

	require(['common-inputs', 'overlay'], function(commonInputs, overlay) {

		angular.module('TH', ['phi-common-components']).factory('dataServices', [

			'$http',

			function ($http) {

				return {

					query: function query(url) {

						return $http.get(url);
					},
					search: function search(url, data) {

						return $http.post(url, {terms: data});
					},
					create: function create(url, data, redirectUrl) {

						return $http.post(url, data);
					},
					update: function update(url, data, redirectUrl) {

						return $http.put(url, data);
					},
					destroy: function deleteItem(url) {

						if (!window.confirm('Are you sure you want to delete this event?')) {

							return { success: function() {} };
						}

						return $http.delete(url);
					}
				};
			}
		]);

		angular.bootstrap(document, ['TH']);

	});
}());
