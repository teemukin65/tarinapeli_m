'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Story = mongoose.model('Story'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, story;

/**
 * Story routes tests
 */
describe('Story CRUD tests', function() {
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

		// Save a user to the test db and create new Story
		user.save(function() {
			story = {
				storyparts: [],
				creator: user._id,
				currentWriter: user._id,
			};

			done();
		});
	});

	it('should be able to save Story instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Story
				agent.post('/stories')
					.send(story)
					.expect(200)
					.end(function(storySaveErr, storySaveRes) {
						// Handle Story save error
						if (storySaveErr) done(storySaveErr);

						// Get a list of Stories
						agent.get('/stories')
							.end(function(storiesGetErr, storiesGetRes) {
								// Handle Story save error
								if (storiesGetErr) done(storiesGetErr);

								// Get Stories list
								var stories = storiesGetRes.body;

								// Set assertions
								(stories[0].creator).should.equal(userId);


								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Story instance if not logged in', function(done) {
		agent.post('/stories')
			.send(story)
			.expect(401)
			.end(function(storySaveErr, storySaveRes) {
				// Call the assertion callback
				done(storySaveErr);
			});
	});

	it('should not be able to save Story instance if no creator id is provided', function (done) {
		// Invalidate name field

		story.creator = null;

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;


				// Save a new Story
				agent.post('/stories')
					.send(story)
					.expect(400)
					.end(function(storySaveErr, storySaveRes) {
						// Set message assertion
						(storySaveRes.body.message).should.match('Creator needs to be defined for Story');
						
						// Handle Story save error
						done(storySaveErr);
					});
			});
	});

	it('should be able to update Story instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Story
				agent.post('/stories')
					.send(story)
					.expect(200)
					.end(function(storySaveErr, storySaveRes) {
						// Handle Story save error
						if (storySaveErr) done(storySaveErr);

						// add a story part

						//fake Object id:
						story.storyparts.push('ffffffffffffffffffffffff');


						// Update existing Story
						agent.put('/stories/' + storySaveRes.body._id)
							.send(story)
							.expect(200)
							.end(function(storyUpdateErr, storyUpdateRes) {
								// Handle Story update error
								if (storyUpdateErr) done(storyUpdateErr);

								// Set assertions
								(storyUpdateRes.body._id).should.equal(storySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Stories if not signed in', function(done) {
		// Create new Story model instance
		var storyObj = new Story(story);

		// Save the Story
		storyObj.save(function() {
			// Request Stories
			request(app).get('/stories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Story if not signed in', function(done) {
		// Create new Story model instance
		var storyObj = new Story(story);

		// Save the Story
		storyObj.save(function() {
			request(app).get('/stories/' + storyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('storyparts', []);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Story instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Story
				agent.post('/stories')
					.send(story)
					.expect(200)
					.end(function(storySaveErr, storySaveRes) {
						// Handle Story save error
						if (storySaveErr) done(storySaveErr);

						// Delete existing Story
						agent.delete('/stories/' + storySaveRes.body._id)
							.send(story)
							.expect(200)
							.end(function(storyDeleteErr, storyDeleteRes) {
								// Handle Story error error
								if (storyDeleteErr) done(storyDeleteErr);

								// Set assertions
								(storyDeleteRes.body._id).should.equal(storySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Story instance if not signed in', function(done) {
		// Set Story user 
		story.user = user;

		// Create new Story model instance
		var storyObj = new Story(story);

		// Save the Story
		storyObj.save(function() {
			// Try deleting Story
			request(app).delete('/stories/' + storyObj._id)
			.expect(401)
			.end(function(storyDeleteErr, storyDeleteRes) {
				// Set message assertion
				(storyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Story error error
				done(storyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Story.remove().exec();
		done();
	});
});
