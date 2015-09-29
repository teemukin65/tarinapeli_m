'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var storygames = require('../../app/controllers/storygames.server.controller');

	// Storygames Routes
	app.route('/storygames')
		.get(storygames.list)
		.post(users.requiresLogin, storygames.create);

	app.route('/storygames/:storygameId')
		.get(users.requiresLogin, storygames.read)
		.put(users.requiresLogin, storygames.hasPlayerAuthorization, storygames.update)
		.delete(users.requiresLogin, storygames.hasOwnerAuthorization, storygames.delete);
	app.route('/storygames/:storygameId/players')
		.get(users.requiresLogin, storygames.listPlayers)
		.post(users.requiresLogin, storygames.hasOwnerAuthorization, storygames.callPlayer);

	// Finish by binding the Storygame middleware
	app.param('storygameId', storygames.storygameByID);
};
