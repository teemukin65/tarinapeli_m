/**
 * Created by teemu on 3.9.2015.
 */

'use strict';
angular.module('core').run(['$rootScope', '$log', function ($rootScope, $log) {
    $rootScope.$on('$stateChangeError', function (event, args) {
        $log.error('$stateChangeError, event params:' + args);
    });
}]);
