// This is a custom Angular directive for the underlying lazy
// loading behavior.
// This is called by adding a HTML attribute of "lazy-load" to an
// element.

angular.module('TH').

	directive('lazyLoad', [

		'$rootScope', // Include $rootScope for evented communication

		function ($rootScope) {

			'use strict';

			return {

				// This attaches the function to the element
				link: function (scope, element, attrs) {

					var scrollableEl = document.getElementById('js_scrollable'),
						lastScrollPos = $(scrollableEl).scrollTop(), // Current position
						scrolledPosOnLeave, // Stores scroll position on leave of page
						allowScroll = true; // This is to reduce touching the DOM

					function isElementInViewport (el) {

						var rect = el.getBoundingClientRect();

						// Just check with top and bottom of el are in view
						return (
							rect.top >= 0 &&
							rect.bottom <= (window.innerHeight ||
												document.documentElement.clientHeight)
						);
					}

					function checkLastElVisibility (el) {

						// If element is inside viewport …
						if (isElementInViewport(el)) {

							// … emit an event into to children to load more
							$rootScope.$broadcast('loadMorePost');
						}
					}

					// Listen for storing the scroll position on leave
					$rootScope.$on('setScrollPosition', function () {

						scrolledPosOnLeave = $('#js_scrollable').scrollTop();

					});

					// Listen for setting the scroll position on return
					$rootScope.$on('scrollToPosition', function () {

						// Kind of an ugly way of ensuring elements are not only
						// loaded but painted to the screen. Async for the win!
						setTimeout(function () {
							$('#js_scrollable').scrollTop(scrolledPosOnLeave);
						}, 750);
					});

					// Attach a ready event to the scrollable element.
					angular.element(element).ready(function () {

						var len = element[0].getElementsByTagName('tr').length,
							lastEl = element[0].getElementsByTagName('tr')[len - 1];

						checkLastElVisibility(lastEl);
					});
					// Attach a resize event to the scrollable element.
					angular.element(window).on('resize', function () {

						var len = element[0].getElementsByTagName('tr').length,
							lastEl = element[0].getElementsByTagName('tr')[len - 1];

						checkLastElVisibility(lastEl);
					});
					// Attach a scroll event to the scrollable element.
					angular.element(scrollableEl).on('scroll', function () {

						var len, lastEl, firstEl;

						// Check to see if we should detect scrolling
						if (allowScroll) {

							// If so, set to false
							allowScroll = false;

							// Now allow scrolling 100ms from now.
							setTimeout(function () {

								allowScroll = true;
							}, 100);

							// Detect of we are scrolling down
							if (lastScrollPos < $('#js_scrollable').scrollTop()) {

								lastScrollPos = $('#js_scrollable').scrollTop();

								len = element[0].getElementsByTagName('tr').length;
								lastEl = element[0].getElementsByTagName('tr')[len - 16];
								firstEl = element[0].getElementsByTagName('tr')[0];

								checkLastElVisibility(lastEl);

							} else { // Looks like we are scrolling up

								allowScroll = false;

								// Set to false and place a larger timer for true
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