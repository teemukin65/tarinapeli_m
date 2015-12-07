'use strict';

//Setting up route
angular.module('storygames').config(['$stateProvider',
	function ($stateProvider) {
		// Storygames state routing
		$stateProvider.
			state('listYourGames', {
				url: '/storygames',
				templateUrl: 'modules/storygames/views/list-storygames.client.view.html'
			}).
			state('createGameDefining', {
				url: '/storygames/definition',
				controller: 'StorygamesController',
				resolve: {
					currentGame: function () {
						return {};
					}
				},
				templateUrl: 'modules/storygames/views/create-storygame.client.view.html'

			}).
			state('createGameWaiting', {
				url: '/storygames/:storygameId/invitations',
				resolve: {
					currentGame: ['$stateParams', 'Storygames', function ($stateParams, Storygames) {
						return Storygames.get({storygameId: $stateParams.storygameId});
					}]

				},
				controller: 'StorygamesController',
				templateUrl: 'modules/storygames/views/create-storygame.client.view.html'
			}).
			state('gamePlaying', {
				url: '/storygames/:storygameId',
				controller: 'StorygamesController',
				resolve: {
					currentGame: ['$stateParams', 'Storygames', function ($stateParams, Storygames) {
						return Storygames.get({storygameId: $stateParams.storygameId});
					}]
				},
				templateUrl: 'modules/storygames/views/play-storygame.client.view.html'
			}).
			state('gameShowing', {
				url: '/storygames/:storygameId',
				controller: 'StorygamesController',
				resolve: {
					currentGame: ['$stateParams', 'Storygames', function ($stateParams, Storygames) {
						return Storygames.get({storygameId: $stateParams.storygameId});
					}]
				},
				templateUrl: 'modules/storygames/views/view-storygame.client.view.html'

			}).
			state('listStorygames', {
				url: '/storygames',
				templateUrl: 'modules/storygames/views/view-storygame.client.view.html'

			}).
			state('createStorygame', {
				url: '/storygames/create',
				templateUrl: 'modules/storygames/views/create-storygame.client.view.html'
			}).
			state('viewStorygame', {
				url: '/storygames/:storygameId',
				templateUrl: 'modules/storygames/views/view-storygame.client.view.html'
			}).
			state('editStorygame', {
				url: '/storygames/:storygameId/edit',
				templateUrl: 'modules/storygames/views/play-storygame.client.view.html'
			});
	}
]);
