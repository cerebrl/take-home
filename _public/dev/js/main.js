/*! take-home | Version: 0.0.1 | Concatenated on 2014-01-26 */

// Global controller for client-side behaior.
// This is not route specific, and mostly
// controls the animation direction.

angular.module('TH').

		controller('ctrlrGlobal', [

			'$rootScope', '$scope',

			function ($rootScope, $scope) {

				'use strict';

				// It's best to attach in heritable properties to 
				// objects, rather than straight to scopes
				$rootScope.animate = {};

				// Default to forward
				$rootScope.animate.direction = 'forward';

				// "Globally" accessible function that sets
				// the direction. Pass in either "forward" or
				// "backward".
				$scope.setDirection = function (direction) {

					$rootScope.animate.direction = direction;
				};
			}
		]);

;// End of file

// This is a custom Angular directive for the underlying lazy
// loading behavior.
// This is called by adding a HTML attribute of "lazy-load" to an
// element.

angular.module('TH').

	directive('lazyLoad', [

		'$rootScope', // Include $rootScope for evented communication

		function ($rootScope) {

			'use strict';

			return {

				// This attaches the function to the element
				link: function (scope, element, attrs) {

					var scrollableEl = document.getElementById('js_scrollable'),
						lastScrollPos = $(scrollableEl).scrollTop(), // Current position
						scrolledPosOnLeave, // Stores scroll position on leave of page
						allowScroll = true; // This is to reduce touching the DOM

					function isElementInViewport (el) {

						var rect = el.getBoundingClientRect();

						// Just check with top and bottom of el are in view
						return (
							rect.top >= 0 &&
							rect.bottom <= (window.innerHeight ||
												document.documentElement.clientHeight)
						);
					}

					function checkLastElVisibility (el) {

						// If element is inside viewport …
						if (isElementInViewport(el)) {

							// … emit an event into to children to load more
							$rootScope.$broadcast('loadMorePost');
						}
					}

					// Listen for storing the scroll position on leave
					$rootScope.$on('setScrollPosition', function () {

						scrolledPosOnLeave = $('#js_scrollable').scrollTop();

					});

					// Listen for setting the scroll position on return
					$rootScope.$on('scrollToPosition', function () {

						// Kind of an ugly way of ensuring elements are not only
						// loaded but painted to the screen. Async for the win!
						setTimeout(function () {
							$('#js_scrollable').scrollTop(scrolledPosOnLeave);
						}, 750);
					});

					// Attach a ready event to the scrollable element.
					angular.element(element).ready(function () {

						var len = element[0].getElementsByTagName('tr').length,
							lastEl = element[0].getElementsByTagName('tr')[len - 1];

						checkLastElVisibility(lastEl);
					});
					// Attach a resize event to the scrollable element.
					angular.element(window).on('resize', function () {

						var len = element[0].getElementsByTagName('tr').length,
							lastEl = element[0].getElementsByTagName('tr')[len - 1];

						checkLastElVisibility(lastEl);
					});
					// Attach a scroll event to the scrollable element.
					angular.element(scrollableEl).on('scroll', function () {

						var len, lastEl, firstEl;

						// Check to see if we should detect scrolling
						if (allowScroll) {

							// If so, set to false
							allowScroll = false;

							// Now allow scrolling 100ms from now.
							setTimeout(function () {

								allowScroll = true;
							}, 100);

							// Detect of we are scrolling down
							if (lastScrollPos < $('#js_scrollable').scrollTop()) {

								lastScrollPos = $('#js_scrollable').scrollTop();

								len = element[0].getElementsByTagName('tr').length;
								lastEl = element[0].getElementsByTagName('tr')[len - 16];
								firstEl = element[0].getElementsByTagName('tr')[0];

								checkLastElVisibility(lastEl);

							} else { // Looks like we are scrolling up

								allowScroll = false;

								// Set to false and place a larger timer for true
								setTimeout(function () {

									allowScroll = true;
								}, 500);

							}
						}
					});
				}
			};
		}
	]);

;// End of file

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


;// End of file

angular.module('TH').

		config(['$routeProvider', function ($routeProvider) {

			'use strict';

			var path = window.location.pathname;

			// Test for location specific routes
			if (path.indexOf('send') !== -1) {

				$routeProvider.

						when('/', {

							template: document.getElementById('sendForm').innerHTML,
							controller: 'ctrlrSendMoney'
						}).

						when('/sent-successfully', {

							template: document.getElementById('sentSuccess').innerHTML,
							controller: 'ctrlrSentSuccess'
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

// This is the global data service and cache

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

					// Create "api" url to differentiate from traditional "web" requests
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

					if (options.next) {
						url = url + '?next=' + options.next;
					}

					// Check to see if user has request an item or lazy loading.
					// Lastly, if neither of the above is cache is available?
					if (options.next || options.item || !dataCache[options.type]) {

						return $http.get(url).then(function (response) {

							// Is this an item?
							if (options.item) {
								
								// Assign incoming item to cache object.
								dataCache[options.type][options.item] =
										response.collection;

							// Is this lazy loading?
							} else if (options.next) {

								// Add new items to cached array
								dataCache[options.type].collection =
										dataCache[options.type].collection.
												concat(response.data.data);

							// This must be a collection request so …
							} else {

								// … assign to collection
								dataCache[options.type].collection = response.data;
							}

							return response;
						});
					} else { // Use cache!

						// Since we are using promises, we need to async this
						setTimeout(function () {

							// Call the apply method to alert Angular of change
							$rootScope.$apply(function() {

								if (options.item) {

									// Mimics the successful return of a promise,
									// but it's returning cache
									deferred.resolve({
										data: dataCache[options.type][options.item]
									});

								} else {

									// Mimics the successful return of a promise,
									// but it's returning cache
									deferred.resolve({
										data: dataCache[options.type]
									});
								}
							});
						}, 0);

						// return the promise
						return deferred.promise;
					}
				},
				search: function search(url, data) {
					return $http.post(url, {terms: data});
				},
				create: function create(url, data) {
					return $http.post(url, data).then(function (response) {

						dataCache[response.data.type] = response.data;
					});
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