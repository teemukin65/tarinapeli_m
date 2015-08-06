'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Storygame Schema
 */
var StorygameSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Storygame name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Storygame', StorygameSchema);