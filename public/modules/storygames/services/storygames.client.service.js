'use strict';

//Storygames service used to communicate Storygames REST endpoints
angular.module('storygames').factory('Storygames', ['$resource',
	function($resource) {
		return $resource('storygames/:storygameId/:playersIfNeeded/:inviteEmail/:playerDetail',
			{
				storygameId: '@_id',
				playersIfNeeded: null,
				playerDetail: null,
				inviteEmail: null

		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
