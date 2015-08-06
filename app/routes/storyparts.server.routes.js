'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var storyparts = require('../../app/controllers/storyparts.server.controller');

	// Storyparts Routes
	app.route('/storyparts')
		.get(storyparts.list)
		.post(users.requiresLogin, storyparts.create);

	app.route('/storyparts/:storypartId')
		.get(storyparts.read)
		.put(users.requiresLogin, storyparts.hasAuthorization, storyparts.update)
		.delete(users.requiresLogin, storyparts.hasAuthorization, storyparts.delete);

	// Finish by binding the Storypart middleware
	app.param('storypartId', storyparts.storypartByID);
};
