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