'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Story Schema
 */
var StorySchema = new Schema({

	created: {
		type: Date,
		default: Date.now
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	currentWriter: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	storyparts:[{
		type: Schema.ObjectId,
		ref: 'Storypart'

	}]

});

mongoose.model('Story', StorySchema);
