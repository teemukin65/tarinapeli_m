'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Story = mongoose.model('Story'),
	Storygame = mongoose.model('Storygame'),
	_ = require('lodash');

/**
 * Create a Story
 */
exports.create = function(req, res) {
	var story = new Story(req.body);
	story.user = req.user;

	story.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(story);
		}
	});
};

/**
 * Show the current Story
 */
exports.read = function(req, res) {
	res.jsonp(req.story);
};

/**
 * Update a Story
 */
exports.update = function (req, res) {
	var story = req.story;


	var isStorypartAdded = req.body.storyparts && req.body.storyparts.length > story.storyparts.length;

	var nextPlayerInPlayerList = function (playerList, writerNowId) {
		var currentPlayerInTurn = _.find(playerList, {'user': writerNowId});
		var nextPlayerOrderNumber = currentPlayerInTurn.orderNumber + 1;
		var highestOrderNumber = _.max(playerList, 'orderNumber');
		for (; nextPlayerOrderNumber <= highestOrderNumber; nextPlayerOrderNumber++) {
			currentPlayerInTurn = _.find(playerList, {'orderNumber': nextPlayerOrderNumber});
			if (currentPlayerInTurn) {
				return currentPlayerInTurn.user;
			}
		}
		return _.find(playerList, {'orderNumber': 1}).user; // Start again from the first player.
	};

	story = _.extend(story, req.body);

	if (isStorypartAdded) {
		Storygame.findOne({stories: story._id}).exec(function (gameFindError, game) {
			if (gameFindError) {
				return res.status(400).send({
					//TODO: check if this is really most proper response code
					message: errorHandler.getErrorMessage(gameFindError)
				});
			}
			if (game && game.players) {
				story.currentWriter = nextPlayerInPlayerList(game.players, story.currentWriter);
				if (!story.currentWriter) {
					return res.status(400).send({
						message: 'Next player not available!'
					});
				}
			}
		});
	} //StorypartAdded

	story.save(function (err, savedStory) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(savedStory);
		}
	});
};

/**
 * Delete an Story
 */
exports.delete = function(req, res) {
	var story = req.story ;

	story.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(story);
		}
	});
};

/**
 * List of Stories
 */
exports.list = function (req, res) {
	var storiesQuery = Story.find();
	storiesQuery.sort('-created').populate('storyparts').exec(function (err, stories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stories);
		}
	});
};

/**
 * Story middleware
 */
exports.storyByID = function(req, res, next, id) { 
	Story.findById(id).populate('user', 'displayName').exec(function(err, story) {
		if (err) return next(err);
		if (! story) return next(new Error('Failed to load Story ' + id));
		req.story = story ;
		next();
	});
};

/**
 * Story authorization middleware
 */
exports.hasCurrentWriterAuthorization = function (req, res, next) {

	if (req.story.currentWriter.toJSON() !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.hasAuthorization = function(req, res, next) {
	//TODO story authorization!
	//if (req.story.currentWriter !== req.user.id) {
	//	return res.status(403).send('User is not authorized');
	//}
	next();
};
