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
			}).
			state('gamePlaying.createStory', {
				url: '/stories/create',
				controller: 'StoriesController',
				resolve:{
					currentGame: ['$stateParams', 'Storygames', function ($stateParams, Storygames) {
						return Storygames.get({storygameId: $stateParams.storygameId});
					}],
					currentStory: ['Stories','Authentication', function(Stories, Authentication){
						var story = new Stories ({
							creator: Authentication.user._id,
							currentWriter: Authentication.user._id,
							created: Date.now(),
						});
						return story.$save();
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
