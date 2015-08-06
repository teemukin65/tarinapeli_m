'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Storypart = mongoose.model('Storypart'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, storypart;

/**
 * Storypart routes tests
 */
describe('Storypart CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Storypart
		user.save(function() {
			storypart = {
				name: 'Storypart Name'
			};

			done();
		});
	});

	it('should be able to save Storypart instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Storypart
				agent.post('/storyparts')
					.send(storypart)
					.expect(200)
					.end(function(storypartSaveErr, storypartSaveRes) {
						// Handle Storypart save error
						if (storypartSaveErr) done(storypartSaveErr);

						// Get a list of Storyparts
						agent.get('/storyparts')
							.end(function(storypartsGetErr, storypartsGetRes) {
								// Handle Storypart save error
								if (storypartsGetErr) done(storypartsGetErr);

								// Get Storyparts list
								var storyparts = storypartsGetRes.body;

								// Set assertions
								(storyparts[0].user._id).should.equal(userId);
								(storyparts[0].name).should.match('Storypart Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Storypart instance if not logged in', function(done) {
		agent.post('/storyparts')
			.send(storypart)
			.expect(401)
			.end(function(storypartSaveErr, storypartSaveRes) {
				// Call the assertion callback
				done(storypartSaveErr);
			});
	});

	it('should not be able to save Storypart instance if no name is provided', function(done) {
		// Invalidate name field
		storypart.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Storypart
				agent.post('/storyparts')
					.send(storypart)
					.expect(400)
					.end(function(storypartSaveErr, storypartSaveRes) {
						// Set message assertion
						(storypartSaveRes.body.message).should.match('Please fill Storypart name');
						
						// Handle Storypart save error
						done(storypartSaveErr);
					});
			});
	});

	it('should be able to update Storypart instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Storypart
				agent.post('/storyparts')
					.send(storypart)
					.expect(200)
					.end(function(storypartSaveErr, storypartSaveRes) {
						// Handle Storypart save error
						if (storypartSaveErr) done(storypartSaveErr);

						// Update Storypart name
						storypart.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Storypart
						agent.put('/storyparts/' + storypartSaveRes.body._id)
							.send(storypart)
							.expect(200)
							.end(function(storypartUpdateErr, storypartUpdateRes) {
								// Handle Storypart update error
								if (storypartUpdateErr) done(storypartUpdateErr);

								// Set assertions
								(storypartUpdateRes.body._id).should.equal(storypartSaveRes.body._id);
								(storypartUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Storyparts if not signed in', function(done) {
		// Create new Storypart model instance
		var storypartObj = new Storypart(storypart);

		// Save the Storypart
		storypartObj.save(function() {
			// Request Storyparts
			request(app).get('/storyparts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Storypart if not signed in', function(done) {
		// Create new Storypart model instance
		var storypartObj = new Storypart(storypart);

		// Save the Storypart
		storypartObj.save(function() {
			request(app).get('/storyparts/' + storypartObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', storypart.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Storypart instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Storypart
				agent.post('/storyparts')
					.send(storypart)
					.expect(200)
					.end(function(storypartSaveErr, storypartSaveRes) {
						// Handle Storypart save error
						if (storypartSaveErr) done(storypartSaveErr);

						// Delete existing Storypart
						agent.delete('/storyparts/' + storypartSaveRes.body._id)
							.send(storypart)
							.expect(200)
							.end(function(storypartDeleteErr, storypartDeleteRes) {
								// Handle Storypart error error
								if (storypartDeleteErr) done(storypartDeleteErr);

								// Set assertions
								(storypartDeleteRes.body._id).should.equal(storypartSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Storypart instance if not signed in', function(done) {
		// Set Storypart user 
		storypart.user = user;

		// Create new Storypart model instance
		var storypartObj = new Storypart(storypart);

		// Save the Storypart
		storypartObj.save(function() {
			// Try deleting Storypart
			request(app).delete('/storyparts/' + storypartObj._id)
			.expect(401)
			.end(function(storypartDeleteErr, storypartDeleteRes) {
				// Set message assertion
				(storypartDeleteRes.body.message).should.match('User is not logged in');

				// Handle Storypart error error
				done(storypartDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Storypart.remove().exec();
		done();
	});
});