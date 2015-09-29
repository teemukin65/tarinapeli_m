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
    rows: [{
		type: String,
		trim: false
	}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		required: 'User is required for Story part',
		type: Schema.ObjectId,
		ref: 'User'
	}
});

StorypartSchema.path('rows').validate(function (rows) {
    if (rows && rows.length === 3) {
        return true;
    } else {
        return false;
    }
}, '3 riviä tarvitaan');


mongoose.model('Storypart', StorypartSchema);

module.exports = StorypartSchema;
