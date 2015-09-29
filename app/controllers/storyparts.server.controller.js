'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Storypart = mongoose.model('Storypart'),
	_ = require('lodash');

/**
 * Create a Storypart
 */
exports.create = function(req, res) {
	var storypart = new Storypart(req.body);
	storypart.user = req.user;

	storypart.save(function(err) {
		if (err) {
			console.log('storypart Save err:' + JSON.stringify(err))
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('storypart Save success, storypart:' + JSON.stringify(storypart))
			res.jsonp(storypart);
		}
	});
};

/**
 * Show the current Storypart
 */
exports.read = function(req, res) {
	res.jsonp(req.storypart);
};
/**
 * Show the last line of the Storypart
 * @type {res|*}
 */


exports.getEndOfPart = function( req,res){
	res.jsonp({row:req.storypart.rows[2]});
};

/**
 * Update a Storypart
 */
exports.update = function(req, res) {
	var storypart = req.storypart ;

	storypart = _.extend(storypart , req.body);

	storypart.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(storypart);
		}
	});
};

/**
 * Delete an Storypart
 */
exports.delete = function(req, res) {
	var storypart = req.storypart ;

	storypart.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(storypart);
		}
	});
};

/**
 * List of Storyparts
 */
exports.list = function(req, res) { 
	Storypart.find().sort('-created').populate('user', 'displayName').exec(function(err, storyparts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(storyparts);
		}
	});
};

/**
 * Storypart middleware
 */
exports.storypartByID = function(req, res, next, id) { 
	Storypart.findById(id).populate('user', 'displayName').exec(function(err, storypart) {
		if (err) return next(err);
		if (! storypart) return next(new Error('Failed to load Storypart ' + id));
		req.storypart = storypart ;
		next();
	});
};

/**
 * Storypart authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.storypart.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
