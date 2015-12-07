'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Storygame = mongoose.model('Storygame'),
	Story = mongoose.model('Story'),
	Users = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Storygame
 */
exports.create = function(req, res) {
	var storygame = new Storygame(req.body);
	storygame.user = req.user;
	if (!storygame.gameAdmin) {
		storygame.gameAdmin = storygame.user._id;
	}


	storygame.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(storygame);
		}
	});
};

/**
 * Show the current Storygame
 */
exports.read = function(req, res) {
	res.jsonp(req.storygame);
};

/**
 * Update a Storygame
 */
exports.update = function(req, res) {
	var storygame = req.storygame ;

	storygame = _.extend(storygame , req.body);
	//TODO: Initiate calling of new players
	//

	storygame.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(storygame);
		}
	});
};

/**
 * Delete an Storygame
 */
exports.delete = function(req, res) {
	var storygame = req.storygame ;

	storygame.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(storygame);
		}
	});
};

/**
 * List of Storygames
 */
exports.list = function(req, res) { 
	Storygame.find().sort('-created').populate('user', 'displayName').exec(function(err, storygames) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(storygames);
		}
	});
};

/**
 * Player handling
 */

exports.listPlayers = function (req, res) {
	res.jsonp(req.storygame.players);
};


exports.callPlayer = function (req, res) {
	if (req.storygame.players && typeof req.storygame.players === 'object' &&
		req.storygame.players.constructor === Array) {

		console.log('callPlayer - player array OK:' + JSON.stringify(req.storygame.players));

	}
};

exports.getStoryForPlayer = function (req, res) {
	res.jsonp(req.currentPlayerStory);
};
/**
 * Storygame middleware
 */
exports.storygameByID = function(req, res, next, id) {
	console.log('storygameByID: id:' + id);
	Storygame.findById(id).populate('players stories', '-player.user.password -players.user.salt').exec(function (err, storygame) {
		if (err) {
			return next(err);
		}
		if (!storygame) {
			return next(new Error('Failed to load Storygame ' + id));
		}

		req.storygame = storygame;
		next();
	});
};

exports.currentStoryByInviteEmail = function (req, res, next, inviteEmail) {
	console.log('currentStoryByInviteEmail - inviteEmail:' + inviteEmail);
	Storygame.find({'players.inviteEmail': inviteEmail}).populate('players stories').exec(function (err, storygamesForEmail) {

		if (err) {
			return next(err);
		}
		if (!storygamesForEmail) {
			return next(new Error('Failed to load Storygame according to invite email: ' + inviteEmail));
		}
		Story.find().
			//FIXME: storygamesForEmail is an array, and may already be populated above. No proof yet...
			where('_id').in(storygamesForEmail.stories).
			//populate('storyparts currentWriter').
			exec(function (err, gameStories) {
				if (err) {
					return next(err);
				}
				if (gameStories) {
					console.log('found stories:' + JSON.stringify(gameStories) + ' from Game:' + storygamesForEmail._id);

					req.currentPlayerStory = _.find(gameStories, function (story) {
						return story.currentWriter.email === inviteEmail;
					});
					next();
				} else {
					return next(new Error('Failed to  find story from storyGame:' + storygamesForEmail._id +
						' with invite email: ' + inviteEmail));
				}
			});
	});
};

/**
 * Storygame authorization middleware
 */
exports.hasOwnerAuthorization = function (req, res, next) {
	if (req.storygame.gameAdmin.toJSON() !== req.user.id) {
		return res.status(403).send('User is not authorized admin');
	}
	next();
};

exports.hasPlayerAuthorization = function (req, res, next) {
	console.log('hasPlayerAuthorization: players:' + req.storygame.players + ' user id:' + req.user.id);
	//if ((req.storygame.players && _.indexOf(req.storygame.players , req.user.id) === -1) ) {
	//	return res.status(403).send('User is not authorized player');
	//}
	next();
};


