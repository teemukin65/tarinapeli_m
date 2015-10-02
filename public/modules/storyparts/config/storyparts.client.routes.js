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
			state('gamePlaying.createStory.firstPart', {
				url:'/storyparts/first',
				resolve: {
					previousPartEnd: function () {
						return null;
					}
				},
				controller: 'StorypartsController',
				templateUrl: 'modules/storyparts/views/create-first-storypart.client.view.html'
			}).
			state('gamePlaying.createStory.nextPart', {
                url: '/storyparts/:previousPartId/next',
                resolve: {
                    previousPartEnd: function ($stateParams, Storyparts) {
						if ($stateParams.previousPartId) {
							return Storyparts.getPreviousEnd({storypartId: $stateParams.previousPartId}).$promise;
						} else {
							return {};
						}
                    }
                },
                controller: 'StorypartsController',
                templateUrl: 'modules/storyparts/views/create-next-storypart.client.view.html'

			});
	}]
);
