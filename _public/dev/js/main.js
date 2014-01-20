/*! take-home | Version: 0.0.1 | Concatenated on 2014-01-20 */

angular.module('TH').

		controller('ctrlrGlobal', [

			'$rootScope', '$scope',

			function ($rootScope, $scope) {

				'use strict';

				$rootScope.animate = {};

				$rootScope.animate.direction = 'forward';

				$scope.setDirection = function (direction) {

					$rootScope.animate.direction = direction;
				};
			}
		]);

;// End of file

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


;// End of file

angular.module('TH').

		config(['$routeProvider', function ($routeProvider) {

			'use strict';

			var path = window.location.pathname;

			if (path.indexOf('send') !== -1) {

				$routeProvider.

						when('/', {

							template: document.getElementById('sendForm').innerHTML,
							controller: 'ctrlrSendMoney'
						}).

						when('/sent-successfully', {

							template: document.getElementById('sentSuccess').innerHTML,
							controller: 'ctrlrSendMoney'
						}).

						otherwise({

							template: document.getElementById('sendForm').innerHTML,
							controller: 'ctrlrSendMoney'
						});

			} else if (path.indexOf('transactions') !== -1) {

				$routeProvider.

						when('/', {

							template: document.getElementById('list').innerHTML,
							controller: 'ctrlrTransactions'
						}).

						when('/new', {

							template: document.getElementById('new').innerHTML,
							controller: 'ctrlrTransNew'
						}).

						when('/:id', {

							template: document.getElementById('view').innerHTML,
							controller: 'ctrlrTransItem'
						}).

						otherwise({

							template: document.getElementById('list').innerHTML,
							controller: 'ctrlrTransactions'
						});

			}
		}]);


;// End of file

angular.module('TH').

	// This is the global data service
	factory('dataServices', [
		'$http', '$rootScope', '$q', 'sectionData',
		function ($http, $rootScope, $q, sectionData) {

			'use strict';

			var dataCache = {};

			if (sectionData) {

				// Check if this object doesn't exist, if it doesn't make it
				if (!dataCache[sectionData.type]) {

					dataCache[sectionData.type] = {};
				}
				dataCache[sectionData.type] = sectionData;
			}

			return {

				query: function query(options) {

					// Create "api" url to differentiate from regular "web" requests
					var url = '/api/' + options.type,
						deferred = $q.defer(), // Deferred object for caching
						cacheTimedOut = false; // Default to false to utilize cache

					if (options.item) {
						url = url + '/' + options.item;
						if (!dataCache[options.type]) {
							// Prevents type error
							dataCache[options.type] = {};
						}
						if (!dataCache[options.type][options.item]) {
							// Prevents type error
							dataCache[options.type][options.item] = {};
						}
					}

					// Check to see if cache is available, if not get data
					if (!dataCache[options.type] || options.item) {

						console.log('get data');

						return $http.get(url).then(function (response) {

							// Assign incoming data to cache object.
							if (options.item) {

								dataCache[options.type][options.item] =
										response.type;

							} else {

								dataCache[options.type].data = response.collection;
							}

							return response;
						});
					} else { // Use cache!

						console.log('use cache');

						setTimeout(function () {

							$rootScope.$apply(function() {

								if (options.item) {

									// Mimics the successful return of a promise,
									// but it's returning cache
									deferred.resolve({
										data: dataCache[options.type][options.item].collection
									});

								} else {

									// Mimics the successful return of a promise,
									// but it's returning cache
									deferred.resolve({
										data: dataCache[options.type].collection
									});
								}
							});
						}, 0);

						return deferred.promise;
					}
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
					var message = 'Are you sure you want to delete this?',
						confirm = window.confirm(message);

					if (!confirm) {
						return { success: function() {} };
					}
					return $http.delete(url);
				}
			};
		}
	]);