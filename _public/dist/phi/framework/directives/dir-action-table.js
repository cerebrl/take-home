/************************************\
 * This is a directive for linking table rows
 */

angular.module('phi-action-table', []).
	directive('linkRow', [

		'$location', '$rootScope', '$timeout',

		function ($location, $rootScope, $timeout) {

			'use strict';

			return {

				link: function (scope, element, attrs) {

					element.on('click', function (event) {

						var anchor = this.getElementsByTagName('a')[0],
							location = anchor.getAttribute('href');

						if ($rootScope.animate) {
							$rootScope.animate.direction = 'forward';
						}

						$timeout(function () {

							window.location = location;
						}, 0);
					});
				}
			};
		}]);