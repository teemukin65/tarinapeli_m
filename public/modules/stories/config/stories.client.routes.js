'use strict';

//Setting up route
angular.module('stories').config(['$stateProvider',
	function ($stateProvider) {
		// Stories state routing
		$stateProvider.
			state('listStories', {
				url: '/stories',
				controller: 'StoriesController',
				resolve: {
					currentStory: ['Stories', function (Stories) {
						return Stories.query();
					}]
				},
				templateUrl: 'modules/stories/views/list-stories.client.view.html'
			}).			   			   			   			               			   			               			   			   			   			   			   			   			   			   			   			//TDO: combine the createStory and continueStory states
			state('gamePlaying.createStory', {
				url: '/stories/:storyId/creating',
				controller: 'StoriesController',
				resolve: {
					currentStory: ['$stateParams', 'Storygames', 'Stories', 'Authentication', 'currentGame',
						function ($stateParams, Storygames, Stories, Authentication, currentGame) {
							if ($stateParams.storyId) {
								return Stories.get({'storyId': $stateParams.storyId});
							} else {  // No storyId provided for the state
								currentGame.$promise.then(function (fetchedGame) {
									if (fetchedGame.stories &&
										angular.isArray(fetchedGame.stories) &&
										fetchedGame.stories.length > 0) { // find story where current user is the current writer
										angular.forEach(fetchedGame.stories, function (story) {
											if (story.currentWriter === Authentication.user._id) {
												return story;
											}
										});
									} else { // No story created yet for the game.
										// TODO: use this state in spite of the createStory
										return Stories.save([], {
											creator: Authentication.user._id,
											currentWriter: Authentication.user._id,
											storyParts: []
										});
									}
								});
								return null;  // No story currently available for you to write
							}
						}]
				},
				templateUrl: 'modules/stories/views/edit-story.client.view.html'
			}).
			state('gameShowing.viewStory', {
				url: '/stories/:storyId',
				controller: 'StoriesController',
				resolve:{
					currentStory: ['$stateParams','Stories', function($stateParams, Stories){
						return Stories.get({storyId: $stateParams.storyId});
					}]
				},
				templateUrl: 'modules/stories/views/view-story.client.view.html'
			})

		;
	}
]);
