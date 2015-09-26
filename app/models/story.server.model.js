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
		required: 'Creator needs to be defined for Story',
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
//module.exports = StorySchema; // needed for mongoose2pojo runs...
