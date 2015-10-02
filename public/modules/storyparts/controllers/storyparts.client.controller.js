'use strict';

// Storyparts controller
angular.module('storyparts').controller('StorypartsController',
	['$scope', '$log', '$stateParams', '$state','$location', 'Authentication', 'Storyparts','currentStory', 'previousPartEnd',
	function($scope, $log, $stateParams, $state, $location, Authentication, Storyparts,currentStory, previousPartEnd) {
		$scope.authentication = Authentication;

		$scope.newStoryPartFields={};

		//$scope.previousPartLastLine = previousPartEnd;
		$scope.lastLineOfPrevious = previousPartEnd;

        // Create new Storypart, and redirect where needed
        // param: last -- if not falsy, move viewStory state.
		$scope.createStorypart = function (last) {
			// Create new Storypart object
			var storypart = new Storyparts ({
					rows:$scope.newStoryPartFields.rows,
                    user: Authentication.user._id
				}
			);

			// Redirect after save
			storypart.$save(function(response){
				currentStory.storyparts.push(response._id);
				currentStory.$update(function (updatedStory) {
					if (last) {
						$state.go('gameShowing.viewStory', {storyId: updatedStory._id});
					} else {
						$state.go('gamePlaying.createStory.nextPart', {previousPartId: response._id});
					}
					// Clear form fields
					$scope.newStoryPartFields = {};
				}, function (storyErrorResponse) {
					$scope.error = storyErrorResponse.data.message;
				});


			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};






		$scope.$on('$stateChangeError', function(event ){
			console.log('stateChangeError');
		});

		// Update existing Storypart
		$scope.update = function() {
			var storypart = $scope.storypart;

			storypart.$update(function(response) {
				currentStory.storyparts.push(response._id);
                currentStory.update();
				$state.go('gamePlaying.createStory.nextPart', {previousPartId: response._id});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        // Following are surplus CRUD methods from the template:

        // Remove existing Storypart
        $scope.remove = function (storypart) {
            if (storypart) {
                storypart.$remove();

                for (var i in $scope.storyparts) {
                    if ($scope.storyparts [i] === storypart) {
                        $scope.storyparts.splice(i, 1);
                    }
                }
            } else {
                $scope.storypart.$remove(function () {
                    $location.path('storyparts');
                });
            }
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
