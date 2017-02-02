(function() {
    'use strict';
    var app = angular.module('borealis');

    app.directive('sidenav', function() {
        return {
            templateUrl: '/views/directives/sidenav.html',
            controller: 'MainController',
            replace: true,
            

        };
    });
})();
