'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Storygame = mongoose.model('Storygame'),
	Users = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Storygame
 */
exports.create = function(req, res) {
	var storygame = new Storygame(req.body);
	storygame.user = req.user;

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

/**
 * Storygame middleware
 */
exports.storygameByID = function(req, res, next, id) {
	Storygame.findById(id).populate('players stories', '-player.user.password -players.user.salt').exec(function (err, storygame) {
		if (err) return next(err);
		if (! storygame) return next(new Error('Failed to load Storygame ' + id));
		req.storygame = storygame ;
		next();
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


