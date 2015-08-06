'use strict';

// Storygames controller
angular.module('storygames').controller('StorygamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Storygames',
	function($scope, $stateParams, $location, Authentication, Storygames) {
		$scope.authentication = Authentication;

		// Create new Storygame
		$scope.create = function() {
			// Create new Storygame object
			var storygame = new Storygames ({
				name: this.name
			});

			// Redirect after save
			storygame.$save(function(response) {
				$location.path('storygames/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Storygame
		$scope.remove = function(storygame) {
			if ( storygame ) { 
				storygame.$remove();

				for (var i in $scope.storygames) {
					if ($scope.storygames [i] === storygame) {
						$scope.storygames.splice(i, 1);
					}
				}
			} else {
				$scope.storygame.$remove(function() {
					$location.path('storygames');
				});
			}
		};

		// Update existing Storygame
		$scope.update = function() {
			var storygame = $scope.storygame;

			storygame.$update(function() {
				$location.path('storygames/' + storygame._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Storygames
		$scope.find = function() {
			$scope.storygames = Storygames.query();
		};

		// Find existing Storygame
		$scope.findOne = function() {
			$scope.storygame = Storygames.get({ 
				storygameId: $stateParams.storygameId
			});
		};
	}
]);