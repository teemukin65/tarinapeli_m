'use strict';

//Storyparts service used to communicate Storyparts REST endpoints
angular.module('storyparts').factory('Storyparts', ['$resource',
	function($resource) {
		return $resource('storyparts/:storypartId/:action', { storypartId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			getPreviousEnd: {
				method: 'GET',
				params:{action:'lastLine'}
			}
		});
	}
]);
