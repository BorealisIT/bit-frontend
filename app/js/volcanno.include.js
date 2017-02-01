"use strict";
/*
 * PIXEL INDUSTRY INCLUDE FILE
 * 
 * Includes functions necessary for proper theme work and some helper functions.
 * 
 */
/**
 * Funftion for converting to SVG
 * @param void
 * @return void
 */

function convertToSVG() {
    jQuery(".svg-animate").each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr("id");
        var imgClass = $img.attr("class");
        var imgURL = $img.attr("src");

        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find("svg");

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== "undefined") {
                $svg = $svg.attr("id", imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== "undefined") {
                $svg = $svg.attr("class", imgClass + " replaced-svg");
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr("xmlns:a");

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, "xml");

    });
}

/**
 * Runs on load only
 */
$(window).on("load", function () {
    /**
     * Convert to SVG
     */
    convertToSVG();

    /**
     * Loader
     */
    $("#loading-status").delay(500).fadeOut();
    $("#loader").delay(1000).fadeOut("slow");
    setTimeout(function () {
        VolcannoInclude.triggerAnimation();
    }, 1000);
});

/**
 * Runs on both load and resize
 */

jQuery(window).on("load resize", function () {

    if (
            (navigator.userAgent.match(/iPad/i)) && (navigator.userAgent.match(/iPad/i) !== null)
            || (navigator.userAgent.match(/iPhone/i)) && (navigator.userAgent.match(/iPhone/i) !== null)
            || (navigator.userAgent.match(/Android/i)) && (navigator.userAgent.match(/Android/i) !== null)
            || (navigator.userAgent.match(/BlackBerry/i)) && (navigator.userAgent.match(/BlackBerry/i) !== null)
            || (navigator.userAgent.match(/iemobile/i)) && (navigator.userAgent.match(/iemobile/i) !== null)
            )
    {
        jQuery(".header-wrapper.header-transparent").css({"position": "relative", "padding-top": "15px"});
        jQuery(".header-wrapper.header-style-02").css({"position": "relative"});
    }

    /**
     * Navigation
     */
    var windowWidth = jQuery(window).width();

    if (!VolcannoInclude.isTouchDevice() && (windowWidth >= 1200)) {
        jQuery(".navbar-nav > li.dropdown").addClass("hover");
    } else {
        jQuery(".navbar-nav > li.dropdown").removeClass("hover");
    }
});

(jQuery)(function ($) {
    /**
     * Search animation
     */
    if (!VolcannoInclude.isTouchDevice()) {
        jQuery("#header").on("click", "#search", function (e) {
            e.preventDefault();

            jQuery(this).find("#m_search").slideDown(200).focus();
        });

        jQuery("#m_search").focusout(function (e) {
            jQuery(e.target).slideUp();
        });
    }
    /**
     * Accordion
     */
    (function () {
        "use strict";
        jQuery(".accordion").on("click", ".title", function (event) {
            event.preventDefault();
            jQuery(this).siblings(".accordion .active").next().slideUp("normal");
            jQuery(this).siblings(".accordion .title").removeClass("active");

            if (jQuery(this).next().is(":hidden") === true) {
                jQuery(this).next().slideDown("normal");
                jQuery(this).addClass("active");
            }
        });
        jQuery(".accordion .content").hide();
        jQuery(".accordion .active").next().slideDown("normal");
    })();



    /**
     * Content tabs
     */
    (function () {
        jQuery(".tabs").each(function () {
            var $tabLis = jQuery(this).find("li");
            var $tabContent = jQuery(this).next(".tab-content-wrap").find(".tab-content");

            $tabContent.hide();
            $tabLis.first().addClass("active").show();
            $tabContent.first().show();
        });

        jQuery(".tabs").on("click", "li", function (e) {
            var $this = jQuery(this);
            var parentUL = $this.parent();
            var tabContent = parentUL.next(".tab-content-wrap");

            parentUL.children().removeClass("active");
            $this.addClass("active");

            tabContent.find(".tab-content").hide();
            var showById = jQuery($this.find("a").attr("href"));
            tabContent.find(showById).fadeIn();

            e.preventDefault();
        });
    })();

    if (VolcannoInclude.isTouchDevice()) {
        jQuery("ul.dropdown-menu [data-toggle=dropdown]").on("click", function (event) {
            // Avoid following the href location when clicking
            event.preventDefault();
            // Avoid having the menu to close when clicking
            event.stopPropagation();
            // If a menu is already open we close it
            jQuery(this).closest(".dropdown-submenu").toggleClass("open");
        });
    }

    // Init scripts on page load
    VolcannoInclude.init();
});


var VolcannoInclude = {
    /**
     * Init function
     * @param void
     * @return void
     */
    init: function () {
        VolcannoInclude.scrollToTop();
        VolcannoInclude.smoothScroll();
        VolcannoInclude.placeholderFix();

        if (jQuery(".chart-container").length) {
            VolcannoInclude.chartSize();
        }

        jQuery(window).on("resize", function () {
            if (jQuery(".chart-container").length) {
                VolcannoInclude.chartSize();
            }
        });

        if (VolcannoInclude.isTouchDevice() || VolcannoInclude.isIOSDevice()) {
            VolcannoInclude.wpmlDropdownShow();
        }

        if (!VolcannoInclude.isTouchDevice() || !VolcannoInclude.isIOSDevice()) {
            jQuery(window).on("load resize", function () {
                var window_y = jQuery(document).scrollTop();
                if (window_y > 0) {
                    VolcannoInclude.setStaticHeader(window_y);
                }
                var header_height_02 = jQuery(".header-wrapper.header-style-02").height();

                jQuery(".header-wrapper.header-style-02").next().css("margin-top", header_height_02);
                jQuery(".header-wrapper.header-style-02.header-negative-bottom").next().css("margin-top", header_height_02 - 26);
            });

            var header_height = jQuery(".header-wrapper.header-transparent").height();

            if (jQuery(".header-wrapper.header-transparent").next().hasClass("page-title")) {
                jQuery(".header-wrapper.header-transparent").next().css("padding-top", header_height + 60);
            }

            jQuery(window).on("scroll", function () {
                var position = jQuery(this).scrollTop();
                VolcannoInclude.setStaticHeader(position);
            });
        }


    },
    /**
     * Set static header
     * @param position
     * @return void
     */
    setStaticHeader: function (position) {
        var header_height = jQuery(".header-wrapper.header-transparent").height();
        var header_height_02 = jQuery(".header-wrapper.header-style-02").height();
        var top_bar_height = jQuery(".top-bar-wrapper").outerHeight();

        if (position > header_height_02) {
            jQuery(".header-wrapper.header-style-02").addClass("solid-color");
        } else {
            jQuery(".header-wrapper.header-style-02").removeClass("solid-color");
        }

        if (position > header_height) {
            jQuery(".header-wrapper.header-transparent").addClass("solid-color");
        } else {
            jQuery(".header-wrapper.header-transparent").removeClass("solid-color");
        }

        if (position > header_height) {

            jQuery(".header-wrapper").stop().animate({
                top: -top_bar_height
            }, 50);
        } else {
            jQuery(".header-wrapper").stop().animate({
                top: "0px"
            }, 50);
        }
    },
    /**
     * Trigger animation function
     */
    triggerAnimation: function () {
        if (!VolcannoInclude.isTouchDevice()) {

            // ANIMATED CONTENT
            if (jQuery(".animated")[0]) {
                jQuery(".animated").css("opacity", "0");
            }

            var currentRow = -1;
            var counter = 1;

            jQuery(".triggerAnimation").waypoint(function () {
                var $this = jQuery(this);
                var rowIndex = jQuery(".row").index(jQuery(this).closest(".row"));
                if (rowIndex !== currentRow) {
                    currentRow = rowIndex;
                    jQuery(".row").eq(rowIndex).find(".triggerAnimation").each(function (i, val) {
                        var element = jQuery(this);
                        setTimeout(function () {
                            var animation = element.attr("data-animate");
                            element.css("opacity", "1");
                            element.addClass("animated " + animation);
                        }, (i * 500));
                    });

                }

                //counter++;

            },
                    {
                        offset: "80%",
                        triggerOnce: true
                    }
            );

        }
    },
    /**
     * Contact forms AJAX submit
     * @param id
     * @return data
     */
    contactFormAjax: function (id) {
        // Show recaptcha on form click
        $("form").on("click", function (event) {
            $(".g-recaptcha", this).addClass("recaptcha-visible");
        });
        // Forms
        switch (id) {
            // Contact us form
            case "contact-us":
                $(".wpcf7.wpcf7-" + id + " .wpcf7-submit").on("click", function (event) {
                    event.preventDefault();
                    var name = $("#contact-name").val();
                    var email = $("#contact-email").val();
                    var phone = $("#contact-phone").val();
                    var subject = $("#contact-subject").val();
                    var message = $("#contact-message").val();
                    var recaptcha = grecaptcha.getResponse($("recaptcha_response")[0]);
                    var form_data = new Array({"Name": name, "Email": email, "Phone": phone, "Subject": subject, "Message": message, "Recaptcha": recaptcha});

                    $.ajax({
                        type: "POST",
                        url: "contact.php",
                        data: ({"action": id, "form_data": form_data})
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            $(".wpcf7.wpcf7-" + id + ' input:not([type="submit"])').each(function (index, el) {
                                $(this).val("");
                            });

                            $(".wpcf7.wpcf7-" + id + ' textarea').each(function (index, el) {
                                $(this).val("");
                            });

                            grecaptcha.reset();
                        }
                        alert(data);
                    });
                });
                break;
            case "contact-us-2":
                $(".wpcf7.wpcf7-" + id + " .wpcf7-submit").on("click", function (event) {
                    event.preventDefault();
                    var name = $("#contact-name-2").val();
                    var email = $("#contact-email-2").val();
                    var phone = $("#contact-phone-2").val();
                    var subject = $("#contact-subject-2").val();
                    var message = $("#contact-message-2").val();
                    var recaptcha = grecaptcha.getResponse($("recaptcha_response")[0]);
                    var form_data = new Array({"Name": name, "Email": email, "Phone": phone, "Subject": subject, "Message": message, "Recaptcha": recaptcha});

                    $.ajax({
                        type: "POST",
                        url: "contact.php",
                        data: ({"action": id, "form_data": form_data})
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            $(".wpcf7.wpcf7-" + id + ' input:not([type="submit"])').each(function (index, el) {
                                $(this).val("");
                            });

                            $(".wpcf7.wpcf7-" + id + ' textarea').each(function (index, el) {
                                $(this).val("");
                            });

                            grecaptcha.reset();
                        }
                        alert(data);
                    });
                });
                break;
                // Job application form
            case "job-application":
                $(".wpcf7.wpcf7-" + id + " .wpcf7-submit").on("click", function (event) {
                    event.preventDefault();
                    var firstname = $("#job-listing-name").val();
                    var lastname = $("#job-listing-last-name").val();
                    var email = $("#job-listing-email").val();
                    var address = $("#job-listing-address").val();
                    var city = $("#job-listing-city").val();
                    var zip = $("#job-listing-zip").val();
                    var state = $("#job-listing-state").val();
                    var country = $("#job-listing-country").val();
                    var message = $("#job-listing-message").val();
                    var recaptcha = grecaptcha.getResponse($("recaptcha_response")[0]);
                    var form_data = new Array({
                        "First Name": firstname,
                        "Last Name": lastname,
                        "Email": email,
                        "Address": address,
                        "City": city,
                        "Zip": zip,
                        "State": state,
                        "Country": country,
                        "Message": message,
                        "Recaptcha": recaptcha
                    });

                    $.ajax({
                        type: "POST",
                        url: "contact.php",
                        data: ({"action": id, "form_data": form_data})
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            $(".wpcf7.wpcf7-" + id + ' input:not([type="submit"])').each(function (index, el) {
                                $(this).val("");
                            });

                            $(".wpcf7.wpcf7-" + id + ' textarea').each(function (index, el) {
                                $(this).val("");
                            });
                            grecaptcha.reset();
                        }
                        alert(data);
                    });
                });
                break;
                // Request a quote form
            case "request-quote":
                $(".wpcf7.wpcf7-" + id + " .wpcf7-submit").on("click", function (event) {
                    event.preventDefault();
                    var firstname = $("#quote-name").val();
                    var lastname = $("#quote-last-name").val();
                    var phone = $("#quote-phone").val();
                    var email = $("#quote-email").val();
                    var recaptcha = grecaptcha.getResponse($("recaptcha_response")[0]);
                    var form_data = new Array({"First Name": firstname, "Last Name": lastname, "Phone": phone, "Email": email, "Recaptcha": recaptcha});

                    $.ajax({
                        type: "POST",
                        url: "contact.php",
                        data: ({"action": id, "form_data": form_data})
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            $(".wpcf7.wpcf7-" + id + ' input:not([type="submit"])').each(function (index, el) {
                                $(this).val("");
                                grecaptcha.reset();
                            });
                        }
                        alert(data);
                    });
                });
                break;
                // Newsletter form
            case "newsletter":
                $(".newsletter-widget .submit").on("click", function (event) {
                    event.preventDefault();
                    var email = $(".newsletter-widget .email").val();
                    var form_data = new Array({"Email": email});

                    $.ajax({
                        type: "POST",
                        url: "contact.php",
                        data: ({"action": id, "form_data": form_data})
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            $('.newsletter-widget input:not([type="submit"])').each(function (index, el) {
                                $(this).val("");
                            });
                        }
                        alert(data);
                    });
                });
                break;
            case "comment-form":
                $("." + id + " #comment-reply").on("click", function (event) {
                    event.preventDefault();
                    var name = $("#comment-name").val();
                    var email = $("#comment-email").val();
                    var message = $("#comment-message").val();
                    var recaptcha = grecaptcha.getResponse($("recaptcha_response")[0]);
                    var form_data = new Array({"Name": name, "Email": email, "Message": message, "Recaptcha": recaptcha});

                    $.ajax({
                        type: "POST",
                        url: "contact.php",
                        data: ({"action": id, "form_data": form_data})
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            $('.' + id + ' input:not([type="submit"])').each(function (index, el) {
                                $(this).val("");
                            });

                            $("." + id + ' textarea').each(function (index, el) {
                                $(this).val("");
                            });

                            grecaptcha.reset();
                        }
                        alert(data);
                    });
                });
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Function to check is user is on touch device
     * @param void
     * @return bool
     */
    isTouchDevice: function () {
        return Modernizr.touch;
    },
    /**
     * Function to check is user is on iOS Device
     * @param void
     * @return bool
     */
    isIOSDevice: function () {
        if (
                (navigator.userAgent.match(/iPad/i)) && (navigator.userAgent.match(/iPad/i) !== null)
                || (navigator.userAgent.match(/iPhone/i)) && (navigator.userAgent.match(/iPhone/i) !== null)
                || (navigator.userAgent.match(/Android/i)) && (navigator.userAgent.match(/Android/i) !== null)
                || (navigator.userAgent.match(/BlackBerry/i)) && (navigator.userAgent.match(/BlackBerry/i) !== null)
                || (navigator.userAgent.match(/iemobile/i)) && (navigator.userAgent.match(/iemobile/i) !== null)
                )
        {
            return true;
        } else {
            return false;
        }
    },
    /**
     * WPML Multilanguage Dropdown on Click on touch devices
     * @param void
     * @return void
     */
    wpmlDropdownShow: function () {
        jQuery(".wpml-languages").on("click", function () {
            if (!jQuery(this).hasClass("on-click-wpml-dropdown")) {
                jQuery(this).removeClass("close-wpml-dropdown");
                jQuery(this).addClass("on-click-wpml-dropdown");
            } else {
                jQuery(this).removeClass("on-click-wpml-dropdown").addClass("close-wpml-dropdown");
            }
        });
    },
    /**
     * Function for scrool to top
     * @param void
     * @return void
     */
    scrollToTop: function () {
        jQuery(window).on("scroll", function () {
            if (jQuery(this).scrollTop() > 100) {
                jQuery(".scroll-up").fadeIn();
            } else {
                jQuery(".scroll-up").fadeOut();
            }
        });

        jQuery(".scroll-up").on("click", function () {
            jQuery("html, body").animate({
                scrollTop: 0
            }, 600, jQuery.bez([1, 0, 0, 1]));
            return false;
        });
    },
    /**
     * Function for smooth scroll
     * @param void
     * @return void
     */
    smoothScroll: function () {
        var $window = jQuery(window);        //Window object
        var scrollTime = 0.5;           //Scroll time
        var scrollDistance = 380;       //Distance. Use smaller value for shorter scroll and greater value for longer scroll

        $window.on("mousewheel DOMMouseScroll", function (event) {

            event.preventDefault();

            var delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
            var scrollTop = $window.scrollTop();
            var finalScroll = scrollTop - parseInt(delta * scrollDistance);

            TweenMax.to($window, scrollTime, {
                scrollTo: {y: finalScroll, autoKill: true},
                ease: Power1.easeOut, //For more easing functions see http://api.greensock.com/js/com/greensock/easing/package-detail.html
                autoKill: true,
                overwrite: 5
            });

        });
    },
    /**
     * Function for old browsers placeholder fix
     * @param void
     * @return void
     */
    placeholderFix: function () {
        jQuery("input, textarea").placeholder();
    },
    /**
     * Function for social stream feed
     * @param id
     * @return void
     */
    socialstreamInit: function (id) {
        switch (id) {
            // DeviantArt Feed
            case "deviant-feed":
                jQuery(".deviant-feed").socialstream({
                    socialnetwork: "deviantart",
                    limit: 9,
                    username: "pixel-industry"
                });
                break;
                // Instagram Feed
            case "instagram-feed":
                jQuery(".instagram-feed").socialstream({
                    socialnetwork: "instagram",
                    limit: 9,
                    username: "royaltyplate",
                    accessToken: "3315219258.4b0afec.8788057cf36948e98d27353bee5a77d9" // required
                });
                break;
                // Pinterest Feed
            case "pinterest-feed":
                jQuery(".pinterest-feed").socialstream({
                    socialnetwork: "pinterest",
                    limit: 9,
                    username: "vmrkela"
                });
                break;
                // Flickr Feed
            case "flickr-feed":
                jQuery(".flickr-feed").socialstream({
                    socialnetwork: "flickr",
                    limit: 9,
                    username: "Mrky1"
                });
                break;
                // Dribbble Feed
            case "dribbble-feed":
                jQuery(".dribbble-feed").socialstream({
                    socialnetwork: "dribbble",
                    limit: 9,
                    username: "pixel_industry",
                    accessToken: "a490d57b3dd90b244b5cc1884e12cad3533a25383031089c393124b5d0d1f008" // required
                });
                break;
                // YouTube Feed
            case "youtube-feed":
                jQuery(".youtube-feed").socialstream({
                    socialnetwork: "youtube",
                    limit: 9,
                    username: "UC3QSpZ0E8wVfD90cFwmhN_w",
                    apikey: "AIzaSyAgNhb_1myuXlxLwmhhNigOVFr8ET4XSCA" // REQUIRED - enter your Youtube v3 API key
                });
                break;
                // News Feed (RSS Feed)
            case "newsfeed":
                jQuery(".newsfeed").socialstream({
                    socialnetwork: "newsfeed",
                    limit: 9,
                    username: " http://feeds.feedburner.com/webdesignerdepot?format=xml"
                });
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Function for tweetscroll
     * @param id
     * @return void
     */
    tweetscrollInit: function (id) {
        switch (id) {
            // TweetScroll logo
            case "tweet-logo":
                jQuery(".tweet-logo").tweetscroll({
                    username: "pixel_industry",
                    limit: 20,
                    replies: true,
                    position: "append",
                    animation: "fade",
                    date_format: "style1",
                    visible_tweets: 2,
                    request_url: "tweetscroll/twitter/tweets.php",
                    delay: 7000,
                    logo: true,
                    profile_image: false
                }); // TWEETSCROLL END
                break;
                // TweetScroll profile Image
            case "tweet-profile":
                jQuery(".tweet-profile").tweetscroll({
                    username: "pixel_industry",
                    limit: 20,
                    replies: true,
                    position: "append",
                    animation: "fade",
                    date_format: "style1",
                    visible_tweets: 2,
                    request_url: "tweetscroll/twitter/tweets.php",
                    delay: 7000,
                    logo: false,
                    profile_image: true
                }); // TWEETSCROLL END  
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Function for number counter animation
     * @param void
     * @return void
     */
    odometerContainerInit: function () {
        jQuery(".odometer-container").waypoint(function () {
            jQuery(".odometer").each(function () {
                var v = jQuery(this).data("to");
                var o = new Odometer({
                    el: this,
                    value: 0,
                    duration: 15000
                });
                o.render();
                setInterval(function () {
                    o.update(v);
                });
            });
        },
                {
                    offset: "80%",
                    triggerOnce: true
                }
        );
    },
    /**
     * Function for Nivo Slider initialisation
     * @param id
     * @return void
     */
    nivoSliderInit: function (id) {
        switch (id) {
            case "nivo-slider-01":
                jQuery(".nivo-slider").nivoSlider({
                    effect: "slideInLeft",
                    pauseTime: 5000,
                    nextText: '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>',
                    prevText: '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>',
                    directionNav: true,
                    controlNav: false
                });
                break;
            case "nivo-slider-02":
                jQuery(".nivo-slider").nivoSlider({
                    effect: "slideInLeft",
                    pauseTime: 5000,
                    nextText: '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>',
                    prevText: '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>',
                    directionNav: false
                });
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Function for Master Slider initialisation
     * @param id
     * @return void
     */
    masterSliderInit: function (id) {
        switch (id) {
            case "mastersliderFullArrows":
                var slider = new MasterSlider();
                slider.setup("mastersliderFullArrows", {
                    width: 1140, // slider standard width
                    height: 1000, // slider standard height
                    space: 0,
                    speed: 30,
                    layout: "fullscreen",
                    centerControls: true,
                    loop: true,
                    autoplay: false
                            // more slider options goes here...
                            // check slider options section in documentation for more options.
                });
                // adds Arrows navigation control to the slider.
                slider.control("arrows", {autohide: false});
                slider.api.addEventListener(MSSliderEvent.INIT, function () {
                    jQuery(".ms-nav-next").append('<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>');
                    jQuery(".ms-nav-prev").append('<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>');
                    convertToSVG();
                });
                break;
            case "mastersliderFullWidth":
                var slider = new MasterSlider();
                slider.setup("mastersliderFullWidth", {
                    width: 1140, // slider standard width
                    height: 1000, // slider standard height
                    space: 0,
                    speed: 30,
                    layout: "fullwidth",
                    centerControls: false,
                    loop: false,
                    autoplay: false
                            // more slider options goes here...
                            // check slider options section in documentation for more options.
                });
                break;
            case "mastersliderFullWidth02":
                var slider = new MasterSlider();
                slider.setup("mastersliderFullWidth02", {
                    width: 1140, // slider standard width
                    height: 870, // slider standard height
                    space: 1,
                    speed: 30,
                    layout: "fullwidth",
                    loop: true,
                    autoplay: false
                            // more slider options goes here...
                            // check slider options section in documentation for more options.
                });
                // adds Arrows navigation control to the slider.
                slider.control("arrows", {autohide: false});
                slider.api.addEventListener(MSSliderEvent.INIT, function () {
                    jQuery(".ms-nav-next").append('<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>');
                    jQuery(".ms-nav-prev").append('<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>');
                    convertToSVG();
                });
                break;
            case "mastersliderFullWidth03":
                var slider = new MasterSlider();
                slider.setup("mastersliderFullWidth03", {
                    width: 1140, // slider standard width
                    height: 650, // slider standard height
                    space: 0,
                    speed: 10,
                    layout: "fullwidth",
                    centerControls: true,
                    loop: true,
                    autoplay: true,
                    overPause: true
                            // more slider options goes here...
                            // check slider options section in documentation for more options.
                });
                // adds Arrows navigation control to the slider.
                slider.control("arrows", {autohide: false});
                slider.api.addEventListener(MSSliderEvent.INIT, function () {
                    jQuery(".ms-nav-next").append('<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>');
                    jQuery(".ms-nav-prev").append('<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>');
                    convertToSVG();
                });
                break;
            default:
                // statements_def
                break;

        }
    },
    /**
     * Function for positioning Call To Action On Home Page 01 - Negative Top
     * @param void
     * @return void
     */
    ctaNegativeTop: function () {
        function ctaNegativeTop() {
            var ctaHeight = jQuery(".cta-negative-top").outerHeight();
            jQuery(".cta-negative-top").css("top", -ctaHeight);
        }

        jQuery(document).ready(ctaNegativeTop);
        jQuery(window).on("resize", function(){
            ctaNegativeTop();
        })
    },
    /**
     * Function for positioning Featured Pages Element - Negative Top
     * Present on Management Index
     * @param void
     * @return void
     */
    fpNegativeTop: function () {
        var fpNegativeTop = jQuery(".featured-pages-negative-top .media").height();
        jQuery('.featured-pages-negative-top [class*="col-"]').css("margin-top", -fpNegativeTop);
    },
    /**
     * Function for Equal Height on Rows 
     * Required for The Map on Home Page - It Gives Height to The Map
     * @param void
     * @return void
     */
    mapHeight: function () {
        function equalHeight() {
            jQuery('.row-equal-height *[class*="custom-col-padding"]').each(function () {
                var maxHeight = jQuery(this).outerHeight();
                jQuery('.row-equal-height *[class*="empty"] *[id*="map"]').height(maxHeight);
            });
        }

        jQuery(document).ready(equalHeight);
        jQuery(window).on("resize", function(){
            equalHeight();
        });        
    },
    /**
     * Image Parallax Animation
     * Present on Tourism Index Page
     * @param void
     * @return void
     */

    imgParallaxAnimation: function () {
        jQuery(".img-animate-container").each(function () {
            var attr_width = jQuery(this).attr("data-width");
            var attr_top = jQuery(this).attr("data-top");
            var attr_left = jQuery(this).attr("data-left");

            jQuery(this).find(".img-animate").css({
                "width": attr_width + "px",
                "top": attr_top + "px",
                "left": attr_left + "px"
            });

            var height = 0;

            jQuery(this).children(".img-animate").each(function () {
                height = Math.max(height, jQuery(this).height());
            });

            jQuery(this).parent().css("min-height", height);
        });
    },
    /**
     * Function for Message Boxes Element - Close Button
     * @param void
     * @return void
     */
    messageShowClose: function () {
        jQuery(".message-boxes").on("click", function () {
            jQuery(this).find(".message-close").css("opacity", "1");
        });
    },
    messageClose: function () {
        (function () {
            // INFORMATION BOXES 
            jQuery(".message-boxes .message-close").on("click", function () {
                jQuery(this).parent().fadeOut(300);
            });
        })();
    },
    /**
     * Function for passing chart values - width and height
     * @param void
     * @return void
     */
    chartSize: function () {
        jQuery(".chart-container").each(function () {

            var chartWidth = jQuery(this).data("width");
            var chartHeight = jQuery(this).data("height");

            var chartParentWidth = jQuery(this).parent().width();

            if (chartWidth >= chartParentWidth) {
                jQuery(this).width(chartParentWidth);
            } else {
                jQuery(this).width(chartWidth);
            }
            jQuery(this).height(chartHeight);
        });
    },
    /**
     * Function for pie chart initialisation
     * @param id
     * @return void
     */
    pieChartInit: function (id) {
        switch (id) {
            case "pieChart":
                jQuery(".pieChart").waypoint(function () {
                    var ctx = document.getElementsByClassName("pieChart");
                    var myChart = new Chart(ctx, {
                        type: "pie",
                        data: {
                            labels: ["Label One", "Label Two"],
                            datasets: [{
                                    data: [75, 25],
                                    backgroundColor: [
                                        "#061640",
                                        "#0bb4ce"
                                    ]
                                }]
                        }
                    });
                },
                        {
                            offset: "80%",
                            triggerOnce: true
                        }

                );
                break;
            case "pieChart-2":
                jQuery(".pieChart-2").waypoint(function () {
                    var ctx = document.getElementsByClassName("pieChart-2");
                    var myChart2 = new Chart(ctx, {
                        type: "pie",
                        data: {
                            labels: ["Label One", "Label Two"],
                            datasets: [{
                                    data: [35, 65],
                                    backgroundColor: [
                                        "#b2dfa8",
                                        "#97c98c"
                                    ]
                                }]
                        }
                    });
                },
                        {
                            offset: "80%",
                            triggerOnce: true
                        }

                );
                break;
            case "pieChart-3":
                jQuery(".pieChart").waypoint(function () {
                    var ctx = document.getElementsByClassName("pieChart");
                    var myChart = new Chart(ctx, {
                        type: "pie",
                        data: {
                            labels: ["In-house IT Security Cost", "IT Security Cost with ConsultingPress"],
                            datasets: [{
                                    data: [75, 25],
                                    backgroundColor: [
                                        "#061640",
                                        "#0bb4ce"
                                    ],
                                    hoverBackgroundColor: [
                                        "#081b4f",
                                        "#0fc1dc"
                                    ]
                                }]
                        }
                    });
                },
                        {
                            offset: "80%",
                            triggerOnce: true
                        }

                );
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Function for bar chart initialisation
     * @param id
     * @return void
     */
    barChartInit: function (id) {
        switch (id) {
            case "barChart":
                jQuery(".barChart").waypoint(function () {
                    var ctx = document.getElementsByClassName("barChart");
                    var barChart = new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: ["A", "B", "C", "D", "E", "F", "G"],
                            datasets: [{
                                    label: "Dataset 1",
                                    backgroundColor: "#6ec25b",
                                    data: [25, 85, 24, 32, 76, 58, 49]
                                }, {
                                    label: "Dataset 2",
                                    backgroundColor: "#071740",
                                    data: [15, 28, 47, 89, 22, 65, 28]
                                }]
                        },
                        options: {
                            // Elements options apply to all of the options unless overridden in a dataset
                            // In this case, we are setting the border of each bar to be 2px wide and green
                            elements: {
                                rectangle: {
                                    borderWidth: 2,
                                    borderColor: "#eee",
                                    borderSkipped: "bottom"
                                }
                            },
                            responsive: true,
                            legend: {
                                position: "top"
                            },
                            title: {
                                display: true,
                                text: "Bar Chart Multiple Data Sets"
                            }
                        }
                    });
                },
                        {
                            offset: "80%",
                            triggerOnce: true
                        }
                );
                break;
            case "barChart-2":
                jQuery(".barChart-2").waypoint(function () {
                    var ctx = document.getElementsByClassName("barChart-2");
                    var barChart = new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: ["A", "B", "C", "D", "E", "F", "G"],
                            datasets: [{
                                    label: "Dataset 1",
                                    backgroundColor: "#6ec25b",
                                    data: [25, 85, 24, 32, 76, 58, 49]
                                }]
                        },
                        options: {
                            // Elements options apply to all of the options unless overridden in a dataset
                            // In this case, we are setting the border of each bar to be 2px wide and green
                            elements: {
                                rectangle: {
                                    borderWidth: 2,
                                    borderColor: "#eee",
                                    borderSkipped: "bottom"
                                }
                            },
                            responsive: true,
                            legend: {
                                position: "top"
                            },
                            title: {
                                display: true,
                                text: "Bar Chart Single Data Set"
                            }
                        }
                    });
                },
                        {
                            offset: "80%",
                            triggerOnce: true
                        }
                );
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Function for line chart initialisation
     * @param id
     * @return void
     */
    lineChartInit: function (id) {
        switch (id) {
            case "lineChart":
                jQuery(".lineChart").waypoint(function () {
                    var ctx = document.getElementsByClassName("lineChart");
                    var myChart = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: ["January", "February", "March", "April", "May", "June", "July"],
                            datasets: [{
                                    label: "Line Dataset",
                                    fill: false,
                                    backgroundColor: "#071740",
                                    borderColor: "#071740",
                                    pointBorderColor: "#44d1bb",
                                    pointBackgroundColor: "#44d1bb",
                                    pointBorderWidth: 3,
                                    data: [65, 59, 80, 81, 56, 55, 40]
                                }]
                        }
                    });
                },
                        {
                            offset: "80%",
                            triggerOnce: true
                        }

                );
                break;
            case "lineChart-2":
                jQuery(".lineChart-2").waypoint(function () {
                    var ctx = document.getElementsByClassName("lineChart-2");
                    var myChart = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: ["January", "February", "March", "April", "May", "June", "July"],
                            datasets: [{
                                    label: "Line Dataset 01",
                                    fill: false,
                                    backgroundColor: "#6ec25b",
                                    borderColor: "#8be077",
                                    pointBorderColor: "#8be077",
                                    pointBackgroundColor: "#8be077",
                                    pointBorderWidth: 3,
                                    data: [65, 30, 45, 9, 56, 55, 40]
                                },
                                {
                                    label: "Line Dataset 02",
                                    fill: false,
                                    borderColor: "#071740",
                                    pointBorderColor: "#44d1bb",
                                    pointBackgroundColor: "#44d1bb",
                                    pointBorderWidth: 3,
                                    data: [15, 24, 38, 90, 24, 77, 0]
                                }]
                        }
                    });
                },
                        {
                            offset: "80%",
                            triggerOnce: true
                        }

                );
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Function for owl carousel initialisation
     * @param id
     * @return void
     */
    owlCarouselInit: function (id) {
        switch (id) {
            // Services carousel
            case "services-carousel":
                jQuery("#services-carousel").owlCarousel({
                    items: 3,
                    dots: false,
                    nav: true,
                    navText: ['<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>', '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>'],
                    loop: true,
                    autoplay: false,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    margin: 0,
                    responsiveClass: true,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1,
                            autoHeight: true
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 3
                        }
                    }
                });
                break;
                // Services carousel 02
            case "services-carousel-02":
                jQuery("#services-carousel-02").owlCarousel({
                    items: 3,
                    dots: false,
                    nav: true,
                    navText: ['<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>', '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>'],
                    loop: true,
                    autoplay: false,
                    autoHeight: false,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    margin: 30,
                    responsiveClass: true,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 3
                        }
                    }
                });
                break;
                // Testimonial carousel
            case "testimonial-carousel":
                jQuery("#testimonial-carousel").owlCarousel({
                    items: 1,
                    dots: false,
                    nav: true,
                    navText: ['<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>', '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>'],
                    loop: true,
                    autoplay: false,
                    autoHeight: true,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    margin: 0,
                    responsiveClass: true,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 1
                        },
                        1000: {
                            items: 1
                        }
                    }
                });
                break;
                // Testimonial carousel 02
            case "testimonial-carousel-02":
                jQuery("#testimonial-carousel-02").owlCarousel({
                    items: 2,
                    dots: false,
                    nav: true,
                    navText: ['<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>', '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>'],
                    loop: true,
                    autoplay: false,
                    autoHeight: false,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    margin: 30,
                    responsiveClass: true,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 1
                        },
                        1000: {
                            items: 2
                        }
                    }
                });
                break;
                // Testimonial carousel 03
            case "testimonial-carousel-03":
                jQuery("#testimonial-carousel-03").owlCarousel({
                    items: 1,
                    dots: false,
                    nav: false,
                    navText: ['<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>', '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>'],
                    loop: true,
                    autoplay: true,
                    autoHeight: false,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    margin: 30,
                    responsiveClass: true,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 1
                        },
                        1000: {
                            items: 1
                        }
                    }
                });
                break;
                // Clients carousel
            case "client-carousel":
                jQuery("#client-carousel").owlCarousel({
                    items: 6,
                    dots: false,
                    nav: false,
                    navText: ['<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>', '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>'],
                    loop: true,
                    autoplay: true,
                    autoHeight: false,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    margin: 30,
                    responsiveClass: true,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 2
                        },
                        600: {
                            items: 3
                        },
                        1000: {
                            items: 6
                        }
                    }
                });
                break;
                // Featured Pages Carousel
            case "featured-pages-carousel":
                jQuery("#featured-pages-carousel").owlCarousel({
                    items: 3,
                    dots: false,
                    nav: true,
                    navText: ['<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>', '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>'],
                    loop: true,
                    autoplay: true,
                    autoHeight: false,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    margin: 30,
                    responsiveClass: true,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 3
                        }
                    }
                });
                // Latest posts carousel
            case "latest-posts-carousel":
                jQuery("#latest-posts-carousel").owlCarousel({
                    items: 3,
                    dots: false,
                    nav: true,
                    navText: ['<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>', '<img class="svg-animate" src="images/svg/circle-icon.svg" alt="circle icon"/>'],
                    loop: true,
                    autoplay: false,
                    autoHeight: true,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: true,
                    margin: 30,
                    responsiveClass: true,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 3
                        }
                    }
                });
                break;
            default:
                // statements_def
                break;
        }
    }
};


