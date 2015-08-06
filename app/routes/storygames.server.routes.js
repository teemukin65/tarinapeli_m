'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var storygames = require('../../app/controllers/storygames.server.controller');

	// Storygames Routes
	app.route('/storygames')
		.get(storygames.list)
		.post(users.requiresLogin, storygames.create);

	app.route('/storygames/:storygameId')
		.get(storygames.read)
		.put(users.requiresLogin, storygames.hasAuthorization, storygames.update)
		.delete(users.requiresLogin, storygames.hasAuthorization, storygames.delete);

	// Finish by binding the Storygame middleware
	app.param('storygameId', storygames.storygameByID);
};
