'use strict';

// Storygames controller
angular.module('storygames').controller('StorygamesController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Storygames',
	function ($scope, $stateParams, $state, $location, Authentication, Storygames) {
		$scope.authentication = Authentication;

		$scope.newGameDefinitions = {};
		$scope.newGameDefinitions.gameAdmin = $scope.authentication.user._id;
		$scope.newGameDefinitions.players = [];

		$scope.isGameDefining = function () {
			$state.includes('createGameDefining');
		};
		$scope.startGameDefinition = function () {
			$scope.newGameDefinitions.players[0] = {
				user: $scope.newGameDefinitions.gameAdmin,
				inviteEmail: $scope.authentication.user.email,
				orderNumber: 1
			};
			$state.go('createGameDefining');

		};

		$scope.storygameDefinitionReady = function () {
			$scope.newGameDefinitions.created = Date.now;
			var newStoryGame = new Storygames($scope.newGameDefinitions);
			newStoryGame.$save(function (response) {
					$state.go('createGameWaiting', {storygameId: response._id});
				},
				function (errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		};
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
