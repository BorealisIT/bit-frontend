(function() {
    'use strict';

    /**
     * @ngdoc overview
     * @name neatNycApp
     * @description
     * # neatNycApp
     *
     * Main module of the application.
     */
    angular
        .module('borealis', ['ui.router', 'uiGmapgoogle-maps'])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'uiGmapGoogleMapApiProvider', function($stateProvider, $urlRouterProvider, $locationProvider, uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyAJyaZXxDI2C8g_eCGkBED6TLqsZ7QKShQ',
                libraries: 'weather,geometry,visualization'
            });
            $urlRouterProvider.otherwise('/');
            var stdHeader = {
                templateUrl: 'views/header.html',
                controller: 'MainController',
                controllerAs: 'main'
            };
            var footer = {
                templateUrl: 'views/footer.html',
                controller: 'MainController',
                controllerAs: 'main'
            };
            $stateProvider
                .state('home', {
                    url: '/',
                    name: 'main',
                    controller: 'MainController',
                    controllerAs: 'main',
                    views: {
                        header: stdHeader,
                        content: {
                            templateUrl: 'views/main.html',
                            controller: 'MainController',
                            controllerAs: 'main'
                        },
                        footer: footer
                    }
                }).state('privacy', {
                    url: '/privacy',
                    name: 'main',
                    controller: 'MainController',
                    controllerAs: 'main',
                    views: {
                        header: stdHeader,
                        content: {
                            templateUrl: 'views/privacy.html',
                            controller: 'MainController',
                            controllerAs: 'main'
                        },
                        footer: footer
                    }
                });
            $locationProvider.html5Mode(true);


        }])
        .run(function() {

        });
})();
