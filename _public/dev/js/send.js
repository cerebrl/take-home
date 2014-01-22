/*! take-home | Version: 0.0.1 | Concatenated on 2014-01-22 */

angular.module('TH').controller('ctrlrSendMoney', [
	'$scope', '$rootScope', 'dataServices',
	function ($scope, $rootScope, dataServices) {

		'use strict';

		$scope.send = {};
		$scope.send.currency = 'USD';
		$scope.currencySymbol = '$';
		$scope.showSpinner = false;

		$scope.changeSymbol = function (currency) {

			console.log(currency);

			switch (currency) {
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

		$scope.sendMoney = function () {

			var url = '/api/send';

			if ($scope.sendMoneyForm.$valid) {

				if ($scope.send.amount > 0) {

					$scope.sending = 'active';
					$scope.showSpinner = true;

					dataServices.create(url, $scope.send).
						success(function () {

							$scope.sending = false;

							$rootScope.animate.direction = 'forward';
							window.location.hash = "#/sent-successfully";
						});

				} else {

					$scope.formMessage = "Error: Amount cannot be a negative number.";
				}

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