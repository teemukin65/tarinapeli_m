'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Storypart Schema
 */
var StorypartSchema = new Schema({
	rows:[ {
		type: String,
		default: '',
		maxlength:80,
		trim: false
	}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Storypart', StorypartSchema);
