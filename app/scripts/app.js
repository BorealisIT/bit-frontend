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
        .module('borealis', ['ui.router', 'ncy-angular-breadcrumb', 'ngSanitize'])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $breadcrumbProvider) {

            $breadcrumbProvider.setOptions({
                prefixStateName: 'home',
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
                }).state('contact', {
                    url: '/contact',
                    name: 'contact',
                    views: {
                        header: stdHeader,
                        content: {
                            templateUrl: 'views/contact/contact.html',
                            controller: 'MainController',
                            controllerAs: 'main'
                        },
                        footer: footer
                    },
                    ncyBreadcrumb: {
                        parent: 'home',
                        label: 'Contact Us'
                    }
                }).state('about', {
                    url: '/about',
                    name: 'about',
                    views: {
                        header: stdHeader,
                        content: {
                            templateUrl: '/views/about/about.html',
                            controller: 'MainController',
                            controllerAs: 'main'
                        },
                        footer: footer
                    },
                    ncyBreadcrumb: {
                        parent: 'home',
                        label: 'About'
                    }
                }).state('history', {
                    url: '/about/history',
                    name: 'history',
                    views: {
                        header: stdHeader,
                        content: {
                            templateUrl: '/views/about/history.html',
                            controller: 'MainController',
                            controllerAs: 'main'
                        },
                        footer: footer
                    },
                    ncyBreadcrumb: {
                        parent: 'about',
                        label: 'Company History'
                    }
                }).state('services', {
                    url: '/services',
                    name: 'services',
                    views: {
                        header: stdHeader,
                        content: {
                            templateUrl: '/views/working.html',
                            controller: 'MainController',
                            controllerAs: 'main'
                        },
                        footer: footer
                    },
                    ncyBreadcrumb: {
                        parent: 'home',
                        label: 'Our Services'
                    }
                });
            $locationProvider.html5Mode(true);

        }])
        .run(function($rootScope, $state) {
            $rootScope.$state = $state;

        });
})();
