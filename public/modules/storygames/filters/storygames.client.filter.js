'use strict';

angular.module('storygames').filter('playerStatusFinnish', function () {
    return function (playerStatus) {
        if (playerStatus === 'joined') {
            return 'Valmis peliin';
        } else if (playerStatus === 'invited') {
            return 'Odotamme vastausta';
        } else {
            return '?';
        }
    };
});
