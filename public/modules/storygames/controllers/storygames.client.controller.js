'use strict';

// Storygames controller
angular.module('storygames').controller('StorygamesController',
	['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Storygames',
		function ($scope, $stateParams, $state, $location, Authentication, Storygames) {
		$scope.authentication = Authentication;


			var resetNewGameDefinitionsToDefaults = function () {
				$scope.newGameDefinitions = {};
				$scope.newGameDefinitions.gameAdmin = $scope.authentication.user._id;
				$scope.newGameDefinitions.players = [];
			$scope.newGameDefinitions.players[0] = {
				user: $scope.newGameDefinitions.gameAdmin,
				inviteEmail: $scope.authentication.user.email,
				orderNumber: 1
			};
			};

			if ($state.includes('createGameDefining')) {
				resetNewGameDefinitionsToDefaults();
			} else if ($stateParams.storygameId) {
				$scope.newGameDefinitions = Storygames.get({
					storygameId: $stateParams.storygameId
				});
			}

			$scope.isGameDefining = function () {
				return $state.includes('createGameDefining');
		};

			$scope.playerStatus = function (player) {
				if (player && player.inviteEmail) {
					if (player.user) {
						return 'mukana';
					} else {
						return 'kutsuttu';
					}
				} else {
					return 'kutsumaton';
				}
			};

			$scope.addPlayerInvitationEmail = function () {
				$scope.newGameDefinitions.players.push({
						orderNumber: ($scope.newGameDefinitions.players.length + 1),
						inviteEmail: ''
					}
				);


			};

			$scope.storygameDefinitionReady = function (enteredNewGameDefinitions) {
				enteredNewGameDefinitions.created = Date.now();
				var newStoryGame = new Storygames(enteredNewGameDefinitions);
			newStoryGame.$save(function (response) {
					$state.go('createGameWaiting', {storygameId: response._id});
				},
				function (errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			$scope.storygameInvitationsReady = function (finalizedNewGameDefinitions) {

				finalizedNewGameDefinitions.gameStatus = 'playing';
				finalizedNewGameDefinitions.$update(function (gameInPlayingStatus) {
					$state.go('gamePlaying.createStory.firstPart', {storygameId: finalizedNewGameDefinitions._id});
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
