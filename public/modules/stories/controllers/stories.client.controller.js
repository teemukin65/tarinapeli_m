'use strict';

// Stories controller
angular.module('stories').controller('StoriesController',
	['$scope', '$stateParams', '$location', 'Authentication','Users', 'Stories','currentStory',
	function($scope, $stateParams, $location, Authentication, Users, Stories, currentStory) {
		$scope.authentication = Authentication;

		// Create new Story
		$scope.create = function() {
			// Create new Story object
			var newStory = new Stories ({
				creator: Authentication.user._id,
				currentWriter: Authentication.user._id,
				created: Date.now(),
			});

			// Redirect after save
			newStory.$save(function(response) {
				$location.path('stories/' + response._id+'/storyparts/first');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Story
		$scope.remove = function(aStory) {
			if ( aStory ) {
				aStory.$remove();

				for (var i in $scope.stories) {
					if ($scope.stories [i] === aStory) {
						$scope.stories.splice(i, 1);
					}
				}
			} else {
				currentStory.$remove(function() {
					$location.path('stories');
				});
			}
		};

		// Update existing Story
		$scope.update = function() {
			var storyToUpdate = currentStory;

			storyToUpdate.$update(function(updatedStory) {
				$location.path('stories/' + storyToUpdate._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stories
		$scope.find = function() {
			$scope.stories = Stories.query();
		};

		// Find existing Story
		$scope.findOne = function() {
			currentStory = Stories.get({
				storyId: $stateParams.storyId
			});
		};

		$scope.findUserById = function(id){
			return Users.get({userId:id});
		};
	}
]);
