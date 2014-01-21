angular.module('TH').

	directive('lazyLoad', [

		'$rootScope',

		function ($rootScope) {

			'use strict';

			return {

				link: function (scope, element, attrs) {

					var scrollableEl = document.getElementById('js_scrollable'),
						itemMax = false;

					function isElementInViewport (el) {

						var rect = el.getBoundingClientRect();

						return (
							rect.top >= 0 &&
							rect.left >= 0 &&
							rect.bottom <= (window.innerHeight ||
												document.documentElement.clientHeight) &&
							rect.right <= (window.innerWidth ||
											   document.documentElement.clientWidth)
						);
					}

					function checkLastElVisibility (el) {

						if (isElementInViewport(el)) {
							$rootScope.$broadcast('loadMorePost');
						}
					}

					$rootScope.$on('itemMax', function () {

						var toTop = $('#js_scrollable').scrollTop();

						$('#js_scrollable').scrollTop(toTop - 800);

						itemMax = true;
					});

					angular.element(element).ready(function () {

						var len = element[0].getElementsByTagName('tr').length,
							lastEl = element[0].getElementsByTagName('tr')[len - 1];

						checkLastElVisibility(lastEl);
					});

					angular.element(window).on('resize', function () {

						var len = element[0].getElementsByTagName('tr').length,
							lastEl = element[0].getElementsByTagName('tr')[len - 1];

						checkLastElVisibility(lastEl);
					});

					angular.element(scrollableEl).on('scroll', function () {

						var len = element[0].getElementsByTagName('tr').length,
							lastEl = element[0].getElementsByTagName('tr')[len - 1],
							firstEl = element[0].getElementsByTagName('tr')[0];

						if (itemMax && $('#js_scrollable').scrollTop() === 0) {

							$rootScope.$broadcast('loadMorePre');

						} else {

							checkLastElVisibility(lastEl);
						}
					});
				}
			};
		}
	]);