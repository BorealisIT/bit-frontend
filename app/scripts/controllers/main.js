'use strict';

/**
 * @ngdoc function
 * @name borealis.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the borealis
 */
angular.module('borealis')
    .controller('MainController', function($scope, $state) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.state = $state.current;
        
    });
