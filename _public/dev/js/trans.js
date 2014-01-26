/*! take-home | Version: 0.0.1 | Concatenated on 2014-01-26 */

angular.module('TH').
	controller('ctrlrTransactions', [
		'$scope', '$rootScope', 'dataServices',
		function ($scope, $rootScope, dataServices) {

			'use strict';

			var itemParams = {};

			// Detect the start of a route change
			$rootScope.$on('$routeChangeStart', function () {

				// Set the current scroll position
				$scope.$emit('setScrollPosition');
			});

			// If user is returning to transaction list, emit event to
			// see if the scrollable element had an previous position
			$scope.$emit('scrollToPosition');

			// Grab transactions from cache or server
			dataServices.query({type: 'transactions'}).then(function (response) {

				itemParams = {
					type: response.data.type,
					next: response.data.next,
					limit: response.data.limit
				};
				$scope.transactions = response.data.collection;
			});

			// Listen for load event to trigger the grabbing of more items
			$scope.$on('loadMorePost', function () {

				// If the next item minus the limit is greater than -10,
				// that means we've run out of items, so don't make the call
				if ((itemParams.next - itemParams.limit) > -10) {

					dataServices.query({

							type: 'transactions',
							next: itemParams.next

						}).then(function (response) {

							itemParams.next = response.data.next;

							$scope.transactions = $scope.transactions.
														concat(response.data.data);
						});
				}
			});
		}
	]).
	controller('ctrlrTransItem', [
		'$scope', '$routeParams', 'dataServices',
		function ($scope, $routeParams, dataServices) {

			'use strict';

			// Get item
			dataServices.query({

					type: 'transactions',
					item: $routeParams.id,

				}).then(function (response) {

					$scope.trans = response.data;
				});
		}
	]);