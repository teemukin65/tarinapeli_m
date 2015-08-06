'use strict';

// Storyparts controller
angular.module('storyparts').controller('StorypartsController', ['$scope', '$log', '$stateParams', '$location', 'Authentication', 'Storyparts',
	function($scope, $log, $stateParams, $location, Authentication, Storyparts) {
		$scope.authentication = Authentication;

		$scope.newStoryPartFields={};

		// Create new Storypart
		$scope.create = function() {
			// Create new Storypart object
			var storypart = new Storyparts ({
					rows:$scope.newStoryPartFields.rows,
					user: Authentication.user.id
				}
			);

			// Redirect after save
			storypart.$save(function(response) {
				$location.path('storyparts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Storypart
		$scope.remove = function(storypart) {
			if ( storypart ) { 
				storypart.$remove();

				for (var i in $scope.storyparts) {
					if ($scope.storyparts [i] === storypart) {
						$scope.storyparts.splice(i, 1);
					}
				}
			} else {
				$scope.storypart.$remove(function() {
					$location.path('storyparts');
				});
			}
		};

		// Update existing Storypart
		$scope.update = function() {
			var storypart = $scope.storypart;

			storypart.$update(function() {
				$location.path('storyparts/' + storypart._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Storyparts
		$scope.find = function() {
			$scope.storyparts = Storyparts.query();
		};

		// Find existing Storypart
		$scope.findOne = function() {
			$scope.storypart = Storyparts.get({ 
				storypartId: $stateParams.storypartId
			});
		};
	}
]);
