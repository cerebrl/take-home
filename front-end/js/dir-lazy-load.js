angular.module('TH').

	directive('lazyLoad', [

		'$rootScope',

		function ($rootScope) {

			'use strict';

			return {

				link: function (scope, element, attrs) {

					var scrollableEl = document.getElementById('js_scrollable'),
						itemMax = false,
						scrollEl = $('#js_scrollable').scrollTop(),
						scrollPostion,
						allowScroll = true;

					function isElementInViewport (el) {

						var rect = el.getBoundingClientRect();

						return (
							rect.top >= 0 &&
							rect.bottom <= (window.innerHeight ||
												document.documentElement.clientHeight)
						);
					}

					function checkLastElVisibility (el) {

							if (isElementInViewport(el)) {

								$rootScope.$broadcast('loadMorePost');
							}
					}

					$rootScope.$on('setScrollPosition', function () {

						scrollPostion = $('#js_scrollable').scrollTop();

					});

					$rootScope.$on('scrollToPosition', function () {


						setTimeout(function () {
							$('#js_scrollable').scrollTop(scrollPostion);
						}, 750);
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

						if (allowScroll) {

							var len, lastEl, firstEl;

							allowScroll = false;

							setTimeout(function () {

								allowScroll = true;
							}, 100);

							if (scrollEl < $('#js_scrollable').scrollTop()) {

								scrollEl = $('#js_scrollable').scrollTop();

								len = element[0].getElementsByTagName('tr').length;
								lastEl = element[0].getElementsByTagName('tr')[len - 16];
								firstEl = element[0].getElementsByTagName('tr')[0];

								checkLastElVisibility(lastEl);

							} else {

								allowScroll = false;

								setTimeout(function () {

									allowScroll = true;
								}, 500);

							}
						}
					});
				}
			};
		}
	]);