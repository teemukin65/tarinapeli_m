'use strict';

//Storyparts service used to communicate Storyparts REST endpoints
angular.module('storyparts').factory('Storyparts', ['$resource',
	function($resource) {
		return $resource('storyparts/:storypartId', { storypartId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);