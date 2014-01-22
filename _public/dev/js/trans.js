/*! take-home | Version: 0.0.1 | Concatenated on 2014-01-22 */

angular.module('TH').
	controller('ctrlrTransactions', [
		'$scope', '$rootScope', 'dataServices',
		function ($scope, $rootScope, dataServices) {

			'use strict';

			var itemParams = {},
				itemMax = 60;

			$rootScope.$on('$routeChangeStart', function () {

				$scope.$emit('setScrollPosition');
			});

			$scope.$emit('scrollToPosition');

			dataServices.query({type: 'transactions'}).then(function (response) {

				itemParams = {
					type: response.data.type,
					next: response.data.next,
					limit: response.data.limit
				};
				$scope.transactions = response.data.collection;
			});

			$scope.$on('loadMorePost', function () {

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

			dataServices.query({

					type: 'transactions',
					item: $routeParams.id,

				}).then(function (response) {

					$scope.trans = response.data;
				});
		}
	]).
	controller('ctrlrTransNew', [
		'$scope', '$routeParams', 'dataServices',
		function ($scope, $routeParams, dataServices) {

			'use strict';

			$scope.trans = {};
			$scope.trans.currency = 'USD';
			$scope.currencySymbol = '$';

			$scope.changeSymbol = function () {
				switch ($scope.currency) {
					case 'USD':
						$scope.currencySymbol = '$';
						break;
					case 'EUR':
						$scope.currencySymbol = '€';
						break;
					case 'JPY':
						$scope.currencySymbol = '¥';
						break;
					default:
						// Intentionally left blank
				}
			};

			$scope.saveTrans = function () {

				var url = '/api/transactions';

				if ($scope.saveTransactionForm.$valid) {

					$scope.sending = 'active';

					dataServices.create(url, $scope.trans).
						success(function () {

							$scope.sending = false;
						});

				} else {

					$scope.formMessage = "Error: Please feel in the required fields.";
				}
			};

			$scope.clearForm = function () {

				$scope.send = {};
				$scope.sendMoneyForm.$setPristine();
			};
		}
	]);