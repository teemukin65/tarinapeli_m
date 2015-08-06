'use strict';

//Setting up route
angular.module('storyparts').config(['$stateProvider',
	function ($stateProvider) {
		// Storyparts state routing
		$stateProvider.
			state('listStoryparts', {
				url: '/storyparts',
				templateUrl: 'modules/storyparts/views/list-storyparts.client.view.html'
			}).
			state('createStorypart', {
				url: '/storyparts/create',
				templateUrl: 'modules/storyparts/views/create-storypart.client.view.html'
			}).
			state('viewStorypart', {
				url: '/storyparts/:storypartId',
				templateUrl: 'modules/storyparts/views/view-storypart.client.view.html'
			}).
			state('editStorypart', {
				url: '/storyparts/:storypartId/edit',
				templateUrl: 'modules/storyparts/views/edit-storypart.client.view.html'
			}).
			state('firstPart', {
				templateUrl: 'modules/storyparts/views/create-first-storypart.client.view.html'
			});

	}
]);
