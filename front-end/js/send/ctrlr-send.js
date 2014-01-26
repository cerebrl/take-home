angular.module('TH').controller('ctrlrSendMoney', [
		'$scope', '$rootScope', 'dataServices',
		function ($scope, $rootScope, dataServices) {

			'use strict';

			$scope.send = {}; // This will store the send form's data
			$scope.send.currency = 'USD'; // default
			$scope.currencySymbol = '$'; // default
			$scope.showSpinner = false;

			$scope.changeSymbol = function (currency) {

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

				// Check to see if there are any form errors
				if ($scope.sendMoneyForm.$valid) {

					// Is "amount" positive
					if ($scope.send.amount > 0) {

						// Show overlay and spinner
						$scope.sending = 'active';
						$scope.showSpinner = true;

						// Use the global data service to POST to server
						dataServices.create(url, $scope.send).
							then(function () {

								$scope.sending = false;
								$scope.showSpinner = false;

								// Set animation direction
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
	]).
	controller('ctrlrSentSuccess', [
		'$scope', 'dataServices',
		function ($scope, dataServices) {

			'use strict';

			$scope.sent = {};

			// Grab the incoming JSON from the server for sent money.
			dataServices.query({
				
					type: 'send'
				
				}).then(function (response) {

					$scope.sent = response.data;
				});

		}
	]);