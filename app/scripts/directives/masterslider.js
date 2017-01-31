(function() {
    'use strict';
    var app = angular.module('borealis');

    app.directive('masterslider', function() {
        return {
            templateUrl: '/views/directives/masterslider.html',
            controller: 'MainController',
            replace: true
        };
    });
})();