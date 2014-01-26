// This is the global data service and cache

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

					// Create "api" url to differentiate from traditional "web" requests
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

					if (options.next) {
						url = url + '?next=' + options.next;
					}

					// Check to see if user has request an item or lazy loading.
					// Lastly, if neither of the above is cache is available?
					if (options.next || options.item || !dataCache[options.type]) {

						return $http.get(url).then(function (response) {

							// Is this an item?
							if (options.item) {
								
								// Assign incoming item to cache object.
								dataCache[options.type][options.item] =
										response.collection;

							// Is this lazy loading?
							} else if (options.next) {

								// Add new items to cached array
								dataCache[options.type].collection =
										dataCache[options.type].collection.
												concat(response.data.data);

							// This must be a collection request so …
							} else {

								// … assign to collection
								dataCache[options.type].collection = response.data;
							}

							return response;
						});
					} else { // Use cache!

						// Since we are using promises, we need to async this
						setTimeout(function () {

							// Call the apply method to alert Angular of change
							$rootScope.$apply(function() {

								if (options.item) {

									// Mimics the successful return of a promise,
									// but it's returning cache
									deferred.resolve({
										data: dataCache[options.type][options.item]
									});

								} else {

									// Mimics the successful return of a promise,
									// but it's returning cache
									deferred.resolve({
										data: dataCache[options.type]
									});
								}
							});
						}, 0);

						// return the promise
						return deferred.promise;
					}
				},
				search: function search(url, data) {
					return $http.post(url, {terms: data});
				},
				create: function create(url, data) {
					return $http.post(url, data).then(function (response) {

						dataCache[response.data.type] = response.data;
					});
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