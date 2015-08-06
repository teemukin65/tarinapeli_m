'use strict';

(function() {
	// Storygames Controller Spec
	describe('Storygames Controller Tests', function() {
		// Initialize global variables
		var StorygamesController,
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

			// Initialize the Storygames controller.
			StorygamesController = $controller('StorygamesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Storygame object fetched from XHR', inject(function(Storygames) {
			// Create sample Storygame using the Storygames service
			var sampleStorygame = new Storygames({
				name: 'New Storygame'
			});

			// Create a sample Storygames array that includes the new Storygame
			var sampleStorygames = [sampleStorygame];

			// Set GET response
			$httpBackend.expectGET('storygames').respond(sampleStorygames);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.storygames).toEqualData(sampleStorygames);
		}));

		it('$scope.findOne() should create an array with one Storygame object fetched from XHR using a storygameId URL parameter', inject(function(Storygames) {
			// Define a sample Storygame object
			var sampleStorygame = new Storygames({
				name: 'New Storygame'
			});

			// Set the URL parameter
			$stateParams.storygameId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/storygames\/([0-9a-fA-F]{24})$/).respond(sampleStorygame);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.storygame).toEqualData(sampleStorygame);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Storygames) {
			// Create a sample Storygame object
			var sampleStorygamePostData = new Storygames({
				name: 'New Storygame'
			});

			// Create a sample Storygame response
			var sampleStorygameResponse = new Storygames({
				_id: '525cf20451979dea2c000001',
				name: 'New Storygame'
			});

			// Fixture mock form input values
			scope.name = 'New Storygame';

			// Set POST response
			$httpBackend.expectPOST('storygames', sampleStorygamePostData).respond(sampleStorygameResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Storygame was created
			expect($location.path()).toBe('/storygames/' + sampleStorygameResponse._id);
		}));

		it('$scope.update() should update a valid Storygame', inject(function(Storygames) {
			// Define a sample Storygame put data
			var sampleStorygamePutData = new Storygames({
				_id: '525cf20451979dea2c000001',
				name: 'New Storygame'
			});

			// Mock Storygame in scope
			scope.storygame = sampleStorygamePutData;

			// Set PUT response
			$httpBackend.expectPUT(/storygames\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/storygames/' + sampleStorygamePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid storygameId and remove the Storygame from the scope', inject(function(Storygames) {
			// Create new Storygame object
			var sampleStorygame = new Storygames({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Storygames array and include the Storygame
			scope.storygames = [sampleStorygame];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/storygames\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStorygame);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.storygames.length).toBe(0);
		}));
	});
}());