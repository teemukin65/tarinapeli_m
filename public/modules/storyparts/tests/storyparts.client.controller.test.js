'use strict';

(function() {
	// Storyparts Controller Spec
	describe('Storyparts Controller Tests', function() {
		// Initialize global variables
		var StorypartsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Storyparts controller.
			StorypartsController = $controller('StorypartsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Storypart object fetched from XHR', inject(function(Storyparts) {
			// Create sample Storypart using the Storyparts service
			var sampleStorypart = new Storyparts({
				rows: ['1st line', '2nd line', '3rd line'],
				created: 1443517616313,
				user: '525a8422f6d0f87f0e407a33'

			});

			// Create a sample Storyparts array that includes the new Storypart
			var sampleStoryparts = [sampleStorypart];

			// Set GET response
			$httpBackend.expectGET('storyparts').respond(sampleStoryparts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.storyparts).toEqualData(sampleStoryparts);
		}));

		it('$scope.findOne() should create an array with one Storypart object fetched from XHR using a storypartId URL parameter', inject(function(Storyparts) {
			// Define a sample Storypart object
			var sampleStorypart = new Storyparts({
				name: 'New Storypart'
			});

			// Set the URL parameter
			$stateParams.storypartId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/storyparts\/([0-9a-fA-F]{24})$/).respond(sampleStorypart);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.storypart).toEqualData(sampleStorypart);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Storyparts) {
			// Create a sample Storypart object
			var sampleStorypartPostData = new Storyparts({
				name: 'New Storypart'
			});

			// Create a sample Storypart response
			var sampleStorypartResponse = new Storyparts({
				_id: '525cf20451979dea2c000001',
				name: 'New Storypart'
			});

			// Fixture mock form input values
			scope.name = 'New Storypart';

			// Set POST response
			$httpBackend.expectPOST('storyparts', sampleStorypartPostData).respond(sampleStorypartResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Storypart was created
			expect($location.path()).toBe('/storyparts/' + sampleStorypartResponse._id);
		}));

		it('$scope.update() should update a valid Storypart', inject(function(Storyparts) {
			// Define a sample Storypart put data
			var sampleStorypartPutData = new Storyparts({
				_id: '525cf20451979dea2c000001',
				name: 'New Storypart'
			});

			// Mock Storypart in scope
			scope.storypart = sampleStorypartPutData;

			// Set PUT response
			$httpBackend.expectPUT(/storyparts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/storyparts/' + sampleStorypartPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid storypartId and remove the Storypart from the scope', inject(function(Storyparts) {
			// Create new Storypart object
			var sampleStorypart = new Storyparts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Storyparts array and include the Storypart
			scope.storyparts = [sampleStorypart];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/storyparts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStorypart);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.storyparts.length).toBe(0);
		}));
	});
}());
