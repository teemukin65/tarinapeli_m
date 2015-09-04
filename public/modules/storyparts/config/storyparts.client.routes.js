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
			state('createStory.firstPart', {
				url:'/storyparts/first',
				resolve: {
					previousPartEnd: function () {
						return null;
					}
				},
				controller: 'StorypartsController',
				templateUrl: 'modules/storyparts/views/create-first-storypart.client.view.html'
			}).
            state('createStory.nextPart', {
                url: '/storyparts/:previousPartId/next',
                resolve: {
                    previousPartEnd: function ($stateParams, Storyparts) {
                        return Storyparts.getPreviousEnd({storypartId: $stateParams.previousPartId}).$promise;
                    }
                },
                controller: 'StorypartsController',
                templateUrl: 'modules/storyparts/views/create-next-storypart.client.view.html'

			});
	}]
);
