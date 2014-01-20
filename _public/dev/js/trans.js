/*! take-home | Version: 0.0.1 | Concatenated on 2014-01-20 */

angular.module('TH').
	controller('ctrlrTransactions', [
		'$scope', 'dataServices',
		function ($scope, dataServices) {

			'use strict';

			dataServices.query({type: 'transactions'}).then(function (response) {

				$scope.transactions = response.data;
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

							console.log('Transaction has been saved.');

							$scope.sending = false;
						});

				} else {

					$scope.formMessage = "Error: Please feel in the required fields.";
				}
			};

			$scope.clearForm = function () {

				console.log('clear form');

				$scope.send = {};
				$scope.sendMoneyForm.$setPristine();
			};
		}
	]);