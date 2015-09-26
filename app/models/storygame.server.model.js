'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Storygame Schema
 */
var gameStates = 'defining waiting playing showing'.split(' ');
var StorygameSchema = new Schema({
	gameTitle: {
		type: String,
		default: '',
		required: 'Please fill Storygame name',
		trim: true
	},
	gameDescription: {
		type: String,
		default: '',
		trim: true
	},
	gameStatus: {
		type: String,
		enum: {values: gameStates, message: 'Game state may not be  {VALUE}.'},
		default: 'defining'

	},
	created: {
		type: Date,
		default: Date.now
	},
	gameAdmin: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Game Admin has to be defined'
	},
	players: [{
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		inviteEmail: {
			type: String,
		},
		orderNumber: {
			type: Number,
			min: 1
		}

	}],
	stories: [{
		type: Schema.ObjectId,
		ref: 'Stories'
	}]

});

mongoose.model('Storygame', StorygameSchema);

//module.exports = StorygameSchema;
