(function() {
    'use strict';
    var app = angular.module('borealis');

    app.directive('masterslider', function() {
        return {
            templateUrl: '/views/directives/masterslider.html',
            controller: 'MainController',
            replace: true,
            link: function(scope, elem, attr) {
              VolcannoInclude.masterSliderInit("mastersliderFullWidth03");
              VolcannoInclude.pieChartInit('pieChart-3');
              // INCLUDE OWL CAROUSEL
              VolcannoInclude.owlCarouselInit('testimonial-carousel-02');
              VolcannoInclude.owlCarouselInit('client-carousel');
              //CONTACT FORM AJAX
              VolcannoInclude.contactFormAjax('request-quote');
              //NEWSLETTER FORM AJAX
              VolcannoInclude.contactFormAjax('newsletter');
            },
        };
    });
})();
