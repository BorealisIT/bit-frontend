(function() {
    'use strict';

    /**
     * @ngdoc overview
     * @name borealis
     * @description
     * # borealis
     *
     * Main module of the application.
     */
    angular
        .module('borealis', ['ui.router', 'uiGmapgoogle-maps', 'ncy-angular-breadcrumb', 'ngSanitize'])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'uiGmapGoogleMapApiProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $locationProvider, uiGmapGoogleMapApiProvider, $breadcrumbProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyAJyaZXxDI2C8g_eCGkBED6TLqsZ7QKShQ',
                libraries: 'weather,geometry,visualization'
            });
            $breadcrumbProvider.setOptions({
                templateUrl: 'views/templates/breadcrumb.html'
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
                    },
                    ncyBreadcrumb: {
                        label: 'Home Page'
                    }
                }).state('about', {
                    url: '/about',
                    name: 'main',
                    controller: 'MainController',
                    controllerAs: 'main',
                    views: {
                        header: stdHeader,
                        content: {
                            templateUrl: 'views/about/about.html',
                            controller: 'MainController',
                            controllerAs: 'main'
                        },
                        footer: footer
                    },
                    ncyBreadcrumb: {
                        parent: 'home',
                        label: 'About'
                    }
                }).state('about.history', {
                    url: '/history',
                    name: 'main',
                    controller: 'MainController',
                    controllerAs: 'main',
                    views: {
                        header: stdHeader,
                        content: {
                            templateUrl: 'views/about/history.html',
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
