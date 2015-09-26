'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Storygame = mongoose.model('Storygame'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, storygame;

/**
 * Storygame routes tests
 */
describe('Storygame CRUD tests', function() {
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

		// Save a user to the test db and create new Storygame
		user.save(function() {
			storygame = {
				gameTitle: 'Storygame Name',
				gameDescription: 'This is a longer description of common rules ',
				gameStatus: 'defining',
				players: [],
				stories: []
			};

			done();
		});
	});

	it('should be able to save Storygame instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Storygame
				agent.post('/storygames')
					.send(storygame)
					.expect(200)
					.end(function(storygameSaveErr, storygameSaveRes) {
						// Handle Storygame save error
						if (storygameSaveErr) done(storygameSaveErr);

						// Get a list of Storygames
						agent.get('/storygames')
							.end(function(storygamesGetErr, storygamesGetRes) {
								// Handle Storygame save error
								if (storygamesGetErr) done(storygamesGetErr);

								// Get Storygames list
								var storygames = storygamesGetRes.body;

								// Set assertions
								(storygames[0].user._id).should.equal(userId);
								(storygames[0].name).should.match('Storygame Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Storygame instance if not logged in', function(done) {
		agent.post('/storygames')
			.send(storygame)
			.expect(401)
			.end(function(storygameSaveErr, storygameSaveRes) {
				// Call the assertion callback
				done(storygameSaveErr);
			});
	});

	it('should not be able to save Storygame instance if no name is provided', function(done) {
		// Invalidate name field
		storygame.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Storygame
				agent.post('/storygames')
					.send(storygame)
					.expect(400)
					.end(function(storygameSaveErr, storygameSaveRes) {
						// Set message assertion
						(storygameSaveRes.body.message).should.match('Please fill Storygame name');
						
						// Handle Storygame save error
						done(storygameSaveErr);
					});
			});
	});

	it('should be able to update Storygame instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Storygame
				agent.post('/storygames')
					.send(storygame)
					.expect(200)
					.end(function(storygameSaveErr, storygameSaveRes) {
						// Handle Storygame save error
						if (storygameSaveErr) done(storygameSaveErr);

						// Update Storygame name
						storygame.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Storygame
						agent.put('/storygames/' + storygameSaveRes.body._id)
							.send(storygame)
							.expect(200)
							.end(function(storygameUpdateErr, storygameUpdateRes) {
								// Handle Storygame update error
								if (storygameUpdateErr) done(storygameUpdateErr);

								// Set assertions
								(storygameUpdateRes.body._id).should.equal(storygameSaveRes.body._id);
								(storygameUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Storygames if not signed in', function(done) {
		// Create new Storygame model instance
		var storygameObj = new Storygame(storygame);

		// Save the Storygame
		storygameObj.save(function() {
			// Request Storygames
			request(app).get('/storygames')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Storygame if not signed in', function(done) {
		// Create new Storygame model instance
		var storygameObj = new Storygame(storygame);

		// Save the Storygame
		storygameObj.save(function() {
			request(app).get('/storygames/' + storygameObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('gameTitle', storygame.gameTitle);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Storygame instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Storygame
				agent.post('/storygames')
					.send(storygame)
					.expect(200)
					.end(function(storygameSaveErr, storygameSaveRes) {
						// Handle Storygame save error
						if (storygameSaveErr) done(storygameSaveErr);

						// Delete existing Storygame
						agent.delete('/storygames/' + storygameSaveRes.body._id)
							.send(storygame)
							.expect(200)
							.end(function(storygameDeleteErr, storygameDeleteRes) {
								// Handle Storygame error error
								if (storygameDeleteErr) done(storygameDeleteErr);

								// Set assertions
								(storygameDeleteRes.body._id).should.equal(storygameSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Storygame instance if not signed in', function(done) {
		// Set Storygame user 
		storygame.user = user;

		// Create new Storygame model instance
		var storygameObj = new Storygame(storygame);

		// Save the Storygame
		storygameObj.save(function() {
			// Try deleting Storygame
			request(app).delete('/storygames/' + storygameObj._id)
			.expect(401)
			.end(function(storygameDeleteErr, storygameDeleteRes) {
				// Set message assertion
				(storygameDeleteRes.body.message).should.match('User is not logged in');

				// Handle Storygame error error
				done(storygameDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Storygame.remove().exec();
		done();
	});
});
