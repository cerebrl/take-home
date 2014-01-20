angular.module('TH').

		config(['$routeProvider', function ($routeProvider) {

			'use strict';

			var path = window.location.pathname;

			if (path.indexOf('send') !== -1) {

				$routeProvider.

						when('/', {

							template: document.getElementById('sendForm').innerHTML,
							controller: 'ctrlrSendMoney'
						}).

						when('/sent-successfully', {

							template: document.getElementById('sentSuccess').innerHTML,
							controller: 'ctrlrSendMoney'
						}).

						otherwise({

							template: document.getElementById('sendForm').innerHTML,
							controller: 'ctrlrSendMoney'
						});

			} else if (path.indexOf('transactions') !== -1) {

				$routeProvider.

						when('/', {

							template: document.getElementById('list').innerHTML,
							controller: 'ctrlrTransactions'
						}).

						when('/new', {

							template: document.getElementById('new').innerHTML,
							controller: 'ctrlrTransNew'
						}).

						when('/:id', {

							template: document.getElementById('view').innerHTML,
							controller: 'ctrlrTransItem'
						}).

						otherwise({

							template: document.getElementById('list').innerHTML,
							controller: 'ctrlrTransactions'
						});

			}
		}]);
