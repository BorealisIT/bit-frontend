(function() {
    'use strict';
    var app = angular.module('borealis');

    app.directive('testimonial', function() {
        return {
            templateUrl: '/views/directives/testimonials.html',
            controller: 'MainController',
            replace: true,
            link: function(scope, elem, attr) {
              
              VolcannoInclude.owlCarouselInit('testimonial-carousel-03');
              
            },
        };
    });
})();
