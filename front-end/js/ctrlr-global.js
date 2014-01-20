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