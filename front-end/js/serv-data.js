angular.module('TH').

	// This is the global data service
	factory('dataServices', [
		'$http', '$rootScope', '$q', 'sectionData',
		function ($http, $rootScope, $q, sectionData) {

			'use strict';

			var dataCache = {};

			if (sectionData) {

				// Check if this object doesn't exist, if it doesn't make it
				if (!dataCache[sectionData.type]) {

					dataCache[sectionData.type] = {};
				}
				dataCache[sectionData.type] = sectionData;
			}

			return {

				query: function query(options) {

					// Create "api" url to differentiate from regular "web" requests
					var url = '/api/' + options.type,
						deferred = $q.defer(), // Deferred object for caching
						cacheTimedOut = false; // Default to false to utilize cache

					if (options.item) {
						url = url + '/' + options.item;
						if (!dataCache[options.type]) {
							// Prevents type error
							dataCache[options.type] = {};
						}
						if (!dataCache[options.type][options.item]) {
							// Prevents type error
							dataCache[options.type][options.item] = {};
						}
					}

					// Check to see if cache is available, if not get data
					if (!dataCache[options.type] || options.item) {

						console.log('get data');

						return $http.get(url).then(function (response) {

							// Assign incoming data to cache object.
							if (options.item) {

								dataCache[options.type][options.item] =
										response.type;

							} else {

								dataCache[options.type].data = response.collection;
							}

							return response;
						});
					} else { // Use cache!

						console.log('use cache');

						setTimeout(function () {

							$rootScope.$apply(function() {

								if (options.item) {

									// Mimics the successful return of a promise,
									// but it's returning cache
									deferred.resolve({
										data: dataCache[options.type][options.item].collection
									});

								} else {

									// Mimics the successful return of a promise,
									// but it's returning cache
									deferred.resolve({
										data: dataCache[options.type].collection
									});
								}
							});
						}, 0);

						return deferred.promise;
					}
				},
				search: function search(url, data) {
					return $http.post(url, {terms: data});
				},
				create: function create(url, data, redirectUrl) {
					return $http.post(url, data);
				},
				update: function update(url, data, redirectUrl) {
					return $http.put(url, data);
				},
				destroy: function deleteItem(url) {
					var message = 'Are you sure you want to delete this?',
						confirm = window.confirm(message);

					if (!confirm) {
						return { success: function() {} };
					}
					return $http.delete(url);
				}
			};
		}
	]);