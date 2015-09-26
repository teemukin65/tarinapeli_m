'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Storygame = mongoose.model('Storygame');

/**
 * Globals
 */
var user, storygame;

/**
 * Unit tests
 */
describe('Storygame Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			storygame = new Storygame({
				gameTitle: 'Storygame Name',
				gameDescription: 'This is a longer description of common rules ',
				gameStatus: 'defining',
				players: [],
				stories: []
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return storygame.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function (done) {
			storygame.gameTitle = '';

			return storygame.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Storygame.remove().exec();
		User.remove().exec();

		done();
	});
});
