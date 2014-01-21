angular.module('TH').
	controller('ctrlrTransactions', [
		'$scope', 'dataServices',
		function ($scope, dataServices) {

			'use strict';

			var itemParams = {},
				itemMax = 100;

			dataServices.query({type: 'transactions'}).then(function (response) {

				itemParams = {
					type: response.data.type,
					next: response.data.next,
					limit: response.data.limit,
					total: response.data.total
				};
				$scope.transactions = response.data.collection;
			});

			$scope.$on('loadMorePost', function () {

					console.log(itemParams.next);

				if ((itemParams.next - itemParams.limit) > -20) {

					dataServices.query({

							type: 'transactions',
							next: itemParams.next

						}).then(function (response) {

							if ($scope.transactions.length >= itemMax) {

								$scope.$emit('itemMax');
								$scope.transactions = $scope.transactions.slice(19);
							}

							itemParams.next = response.data.next;

							$scope.transactions = $scope.transactions.
														concat(response.data.data);
						});
				}
			});

			$scope.$on('loadMorePre', function () {

				console.log(itemParams.previous, itemParams.total);

				var previous = itemParams.previous || itemParams.next + $scope.transactions.length;

				if (previous < itemParams.total) {

					dataServices.query({

							type: 'transactions',
							previous: previous

						}).then(function (response) {

							var newArray = [];

							console.log('load more pre');

							if (response.data.data.length !== 0) {

								if ($scope.transactions.length >= itemMax) {

									$scope.$emit('itemMax');
									$scope.transactions = $scope.transactions.slice(80);
								}

								itemParams.previous = response.data.previous;

								newArray = [].concat(response.data.data, $scope.transactions);

								console.log(newArray);

								$scope.transactions = newArray;

								// This is not an "Angular way" to do things,
								// but holy smokes is this lazy loading hard!
								$('#js_scrollable').scrollTop(600);
							}
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