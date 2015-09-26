'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stories = require('../../app/controllers/stories.server.controller');

	// Stories Routes
	app.route('/stories')
		.get(stories.list)
		.post(users.requiresLogin, stories.create);

	app.route('/stories/:storyId')
		.get(stories.read)
		.put(users.requiresLogin, stories.hasCurrentWriterAuthorization, stories.update)
		.delete(users.requiresLogin, stories.hasAuthorization, stories.delete);

	// Finish by binding the Story middleware
	app.param('storyId', stories.storyByID);
};
