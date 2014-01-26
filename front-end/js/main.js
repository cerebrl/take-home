(function () {

	'use strict';

	/************************************************************
	 * Load Javascripts Asynchronously **************************
	 ************************************************************/

	var location = window.location.pathname;

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

			// Phi's Angular Directives
			'common-inputs': '/phi/framework/directives/dir-common-components',
			'action-table': '/phi/framework/directives/dir-action-table'
		}
	});

	// Test which server route we are accessing
	if (location.indexOf('send') !== -1) {

		// Load in send only js
		require(
			['angular-route', 'angular-animate', 'send-money', 'action-table',
			 'common-inputs', 'jquery'],
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

	} else if (location.indexOf('transactions') !== -1) {

		// Load in transaction only js
		require(
			['angular-route', 'angular-animate', 'transactions', 'action-table',
			 'common-inputs', 'jquery'],
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
	}
}());
