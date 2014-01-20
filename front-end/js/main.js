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

			// Bower Packages
			'angular-route': '/vendor-bower/angular-route/angular-route.min',
			'angular-animate': '/vendor-bower/angular-animate/angular-animate.min',
			'jquery': '/vendor-bower/jquery/jquery.min',

			// Angular Controllers
			'send-money': '/js/send',
			'transactions': '/js/trans',

			// UI/Ix jQuery framework
			'overlay': '/phi/framework/components/overlay/overlay',
			'alerts': '/phi/framework/components/alerts/alerts',

			// Phi's Angular Directives
			'common-inputs': '/phi/framework/directives/dir-common-components',
			'action-table': '/phi/framework/directives/dir-action-table'
		},

		// Declare all dependencies
		shim: {
			'overlay': ['jquery'],
			'alerts': ['jquery']
		}
	});

	// Load in js
	require(
		['angular-route', 'angular-animate', 'send-money', 'transactions',
		 'common-inputs', 'action-table', 'overlay'],
		function() {

			// Menu drawer animation
			var body = document.getElementsByTagName('body');

			$(body).on('click', '#js_menuButton', function () {

				var mainPanel = document.getElementById('js_mainPanel');

				$(mainPanel).toggleClass('menuOpen');
				$(mainPanel).toggleClass('menuClose');

				setTimeout(function () {
					$(mainPanel).toggleClass('menuClose');
				}, 500);
			});

			// Manually bootstrap AngularJS
			angular.bootstrap(document, ['TH']);

		});
}());
