'use strict';

//Storygames service used to communicate Storygames REST endpoints
angular.module('storygames').factory('Storygames', ['$resource',
	function($resource) {
		return $resource('storygames/:storygameId', { storygameId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);