'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Storypart = mongoose.model('Storypart');

/**
 * Globals
 */
var user, storypart;

/**
 * Unit tests
 */
describe('Storypart Model Unit Tests:', function() {
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
			storypart = new Storypart({
				rows: ['1st line', '2nd line', '3rd line'],
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return storypart.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without user', function (done) {
			storypart.user = null;

			return storypart.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show error when try to save with too short row', function (done) {
			storypart.rows[1] = 'oo';
			return storypart.save(function (err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Storypart.remove().exec();
		User.remove().exec();

		done();
	});
});
