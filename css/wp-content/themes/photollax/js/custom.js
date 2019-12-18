////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

jQuery(function(){
    "use strict";

//  Variables ----------------------------------------------------------------------------------------------------------

    var sceneMaxSize = jQuery(window).width()*3;
    var selectedTranslateX, selectedTranslateY, selectedRotation, selectedTranslateZ, selectedImage, nextImage, prevImage;
    var animationFinished = true;
    var $dragging = null;
    var firstClickPositionX;
    var firstClickPositionY;
    var pageWrapperLastPositionX;
    var pageWrapperLastPositionY;
    var moveX = 0;
    var moveY = 0;

    var $slide = jQuery(".slide");
    var $body  = jQuery("body");
    var $outerWrapper = jQuery(".outer-wrapper");
    var $videoPopup = jQuery(".video-popup");


    jQuery(".nav-btn").on("click", function(e){
        e.preventDefault();
        $body.toggleClass("show-off-screen-content");
        jQuery(".scrollbar-inner").stop().animate({
            scrollTop: 0
        }, 800);
        jQuery(".off-screen-navigation a").removeClass("active");
    });


//  Pace loading screen ------------------------------------------------------------------------------------------------

    if( jQuery(".loading-overlay").length > 0 ){
        Pace.on("done", function () {
            setTimeout(function () {
                jQuery(".loading-overlay").css("display", "none");
            }, 950);
        });
    }

//  3D Parallax Slider -------------------------------------------------------------------------------------------------

    jQuery("[data-background]").each(function() {
        jQuery(this).css("background-image", "url(" + jQuery(this).attr("data-background") + ")");
    });

    jQuery(".inner-wrapper .slide").each(function(e) {
        var htmlCode;
        if( e === 0 ){
            htmlCode = '<div class="item"><a class="active" href="#' + jQuery(this).attr("id") + '">' + (e+1) + '<span style="background-image: url(' + jQuery(this).find(".image").attr("data-background") + ')"></span></a></div>';
        }
        else {
            htmlCode = '<div class="item"><a href="#' + jQuery(this).attr("id") + '">' + (e+1) + '<span style="background-image: url(' + jQuery(this).find(".image").attr("data-background") + ')"></span></a></div>';
        }
        jQuery(".slider-pager").append(htmlCode);
    });


    jQuery(".slide:not(.first)").each(function() {        
        jQuery(this).attr("data-position-x", randomNumber("position", sceneMaxSize) );
        jQuery(this).css("left", jQuery(this).attr("data-position-x") + "px");
        jQuery(this).attr("data-position-y", randomNumber("position", sceneMaxSize) );
        jQuery(this).css("top", jQuery(this).attr("data-position-y") + "px");
        jQuery(this).attr("data-position-z", randomNumber("position", 2000) );
        jQuery(this).attr("data-rotation", randomNumber("rotation", null) );
        jQuery(this).css("transform", "rotateZ(" + jQuery(this).attr("data-rotation") + "deg) translateZ(" + jQuery(this).attr("data-position-z") + "px)");
    });

    jQuery(".slider-pager a").on("click", function(e){
        e.preventDefault();
        jQuery(".animate").removeClass("idle");
        play( jQuery(this).attr("href") );
    });

    selectedImage = jQuery(".slide.first")[0];
    selectedTranslateX = 0;
    selectedTranslateY = 0;

    jQuery(".next").on("click", function(){
        jQuery(".animate").removeClass("idle");
        if( jQuery(selectedImage).next().length ){
            nextImage = "#" + jQuery(selectedImage).next()[0].id;
            play( nextImage );
        }
        else {
            nextImage = "#" +  $slide.first()[0].id;
            play(nextImage);
        }
    });

    jQuery(".prev").on("click", function(e){
        jQuery(".animate").removeClass("idle");
        e.preventDefault();
        if( jQuery(selectedImage).prev().length ){
            prevImage = "#" + jQuery(selectedImage).prev()[0].id;
            play(prevImage);
        }
        else {
            prevImage = "#" + $slide.last()[0].id;
            play(prevImage);
        }
    });

    $slide.on("dragstart", function(event) { event.preventDefault(); });

    function play(_this){
        animationFinished = false;
        $body.removeClass("zoomed-out");
        $slide.removeClass("active");
        jQuery(".slider-pager a").removeClass("active");
        jQuery(".slider-pager a[href='" + _this + "']").addClass("active");

        jQuery(".slide.first .main-title").css("opacity",.5);
        jQuery(".slide .image").each(function(e) {
            var $this = jQuery(this);
            setTimeout(function(){
                $this.css("opacity",.5);
            }, e * 40);
        });

        selectedTranslateX = jQuery(_this).attr("data-position-x") * -1;
        selectedTranslateY = jQuery(_this).attr("data-position-y") * -1;
        selectedTranslateZ = jQuery(_this).attr("data-position-z") * -1;
        selectedRotation = jQuery(_this).attr("data-rotation") * -1;
        selectedImage = jQuery(_this);

        jQuery(".inner-wrapper").css({'transform': 'translateZ(-' + sceneMaxSize/1.5 + 'px) translateX(' + selectedTranslateX + 'px) translateY(' + selectedTranslateY + 'px)'});

        selectedImage.addClass("active");
        jQuery(".slide:not(.active)").css("pointer-events", "none");
        jQuery(".slide.active").css("pointer-events", "auto");

        setTimeout(function(){
            jQuery(".slide .image").css("opacity", 0);
            selectedImage.find(".image").css("opacity", 1);
            selectedImage.find(".main-title").css("opacity", 1);
            jQuery(".inner-wrapper").css({'transform': 'translateZ(' + selectedTranslateZ + 'px) translateX(' + selectedTranslateX + 'px) translateY(' + selectedTranslateY + 'px)'});
            $outerWrapper.css({'transform': 'rotateZ(' + selectedRotation + 'deg)'});
        }, 1000);

        setTimeout(function(){
            jQuery(selectedImage).find(".animate").each(function(e) {
                var $this = jQuery(this);
                setTimeout(function(){
                    $this.addClass("idle");
                }, e * 100);
            });
            animationFinished = true;
            jQuery(".slide:not(.active) .image").css("opacity", "0");
            jQuery(".slide:not(.active) .main-title").css("opacity", "0");
            jQuery(".slide:not(.active)").addClass("hide-description");
        }, 1500);
    }

    function randomNumber(method, sceneMaxSize){
        if( method === "position" ){
            return Math.floor(Math.random() * sceneMaxSize) - (sceneMaxSize/2);
        }
        else if( method === "rotation" ){
            return Math.floor(Math.random() * 90) + 10;
        }
        else {
            return false;
        }
    }

    $slide.on("click", function(){
        var _this = "#" + jQuery(this).attr("id");
        if( $body.hasClass("zoomed-out") ){
            play(_this);
        }
    });


    jQuery(".zoom-out").on("click", function(e){
        e.preventDefault();
        jQuery(".animate").removeClass("idle");
        jQuery(".inner-wrapper").css("transform", "translateZ(-4000px) translateX(" + selectedTranslateX + "px) translateY(" + selectedTranslateY + "px)");
        $outerWrapper.css("transform", "rotateZ(0deg)");
        $body.addClass("zoomed-out");
        jQuery(".slide.first .main-title").css("opacity",.5);
        jQuery(".slide .image").each(function(e) {
            var $this = jQuery(this);
            setTimeout(function(){
                $this.css("opacity",.5);
            }, e * 40);
        });

        pageWrapperLastPositionX = selectedTranslateX;
        pageWrapperLastPositionY = selectedTranslateY;
        
    });
    
	jQuery(document.body).on("mousemove", function(e) {
		if( $body.hasClass("zoomed-out") ){
			if ($dragging) {
				$body.addClass("dragging");
				moveX = pageWrapperLastPositionX + (e.pageX - firstClickPositionX);
				moveY = pageWrapperLastPositionY + (e.pageY - firstClickPositionY);
				jQuery(".inner-wrapper").css("transform", "translateZ(-4000px) translateX(" + moveX  + "px) translateY(" + moveY + "px)" );
			}
		}
	});

	jQuery(document.body).on("mousedown", ".outer-wrapper", function (e) {
		if( $body.hasClass("zoomed-out") ){
			setTimeout(function(){
				$dragging = jQuery(e.target);
			}, 100);
			firstClickPositionX = e.pageX;
			firstClickPositionY = e.pageY;
			jQuery(".inner-wrapper").css("transition", "0s" );
		}
	});

	jQuery(document.body).on("mouseup", function () {
		$body.removeClass("dragging");
		$dragging = null;
		pageWrapperLastPositionX = moveX;
		pageWrapperLastPositionY = moveY;
		jQuery(".inner-wrapper").css("transition", "1s" );
	});

	jQuery(document.body).on("touchmove", function(e) {
		if( $body.hasClass("zoomed-out") ){
			if ($dragging) {
				$body.addClass("dragging");
				moveX = pageWrapperLastPositionX + (e.originalEvent.touches[0].pageX - firstClickPositionX);
				moveY = pageWrapperLastPositionY + (e.originalEvent.touches[0].pageY - firstClickPositionY);
				jQuery(".inner-wrapper").css("transform", "translateZ(-4000px) translateX(" + moveX  + "px) translateY(" + moveY + "px)" );
			}
		}
	});

	jQuery(document.body).on("touchstart", ".outer-wrapper", function (e) {
		if( $body.hasClass("zoomed-out") ){			
			setTimeout(function(){
				$dragging = jQuery(e.target);
			}, 100);
			firstClickPositionX = e.originalEvent.touches[0].pageX;
			firstClickPositionY = e.originalEvent.touches[0].pageY;
			jQuery(".inner-wrapper").css("transition", "0s" );
		}
	});

	jQuery(document.body).on("touchend", function () {
		$body.removeClass("dragging");
		$dragging = null;
		pageWrapperLastPositionX = moveX;
		pageWrapperLastPositionY = moveY;
		jQuery(".inner-wrapper").css("transition", "1s" );
	});

//  End 3D Parallax Slider ---------------------------------------------------------------------------------------------

    jQuery(".scrollbar-inner").scrollbar();

    if( $body.hasClass("zoomed-out") ){
        jQuery(".inner-wrapper").css("transform", "translateZ(-4000px) translateX(0px) translateY(0px)");
        $outerWrapper.css("transform", "rotateZ(0deg)");
        jQuery(".slide .image").css("opacity", .5);
    }

    jQuery(".modal").on("show.bs.modal", function (e) {
        jQuery(this).find("iframe").contents().find(".iframe-page .page-wrapper").addClass("scrollbar-inner");
        jQuery(this).find("iframe").contents().find(".scrollbar-inner").scrollbar();
        jQuery(this).find("iframe").attr("src", jQuery(this).find("iframe").attr("data-src") );
    });


    jQuery(".off-screen-content [id]").each(function() {
        jQuery(this).attr("data-scroll-offset", jQuery(this).offset().top);
    });

    jQuery(".off-screen-navigation a:not(.new-window)").on("click", function(e){
        //e.preventDefault();
        jQuery(".off-screen-navigation a").removeClass("active");
        jQuery(this).addClass("active");
        $body.addClass("show-off-screen-content");
        var href = jQuery(this).attr("href");
        jQuery(".scrollbar-inner").stop().animate({
            scrollTop: jQuery(href).attr("data-scroll-offset")
        }, 800);
    });

    $outerWrapper.on("click", function(){
        if( $body.hasClass("show-off-screen-content") ){
            $body.removeClass("show-off-screen-content");
        }
    });

    jQuery(".bg-transfer").each(function() {
        jQuery(this).css("background-image", "url("+ jQuery(this).find("img").attr("src") +")" );
    });

    var oldTimeStamp = 0;
    var newTimeStamp = 0;
    var acceleration = 80;
    var delta;

    jQuery(".page-wrapper").on("mousewheel", function(e) {
        oldTimeStamp = newTimeStamp;
        newTimeStamp = e.timeStamp;
        acceleration = (1/(newTimeStamp - oldTimeStamp) * 100);
        delta = e.deltaY * (-1);

        if( animationFinished === true && delta === 1 && !$body.hasClass("show-off-screen-content") ){
            jQuery(".animate").removeClass("idle");
            if( jQuery(selectedImage).next().length ){
                nextImage = "#" + jQuery(selectedImage).next()[0].id;
                play( nextImage );
            }
            else {
                nextImage = "#" +  $slide.first()[0].id;
                play(nextImage);
            }
        }
        else if( animationFinished === true && delta === -1 && !$body.hasClass("show-off-screen-content") ){
            jQuery(".animate").removeClass("idle");
            if( jQuery(selectedImage).prev().length ){
                prevImage = "#" + jQuery(selectedImage).prev()[0].id;
                play(prevImage);
            }
            else {
                prevImage = "#" + $slide.last()[0].id;
                play(prevImage);
            }
        }
    });

    //  Magnific Popup

    if (jQuery(".slide-popup").length > 0) {
        jQuery(".image-popup").magnificPopup({
            type: "image",
            removalDelay: 300,
            mainClass: "mfp-fade",
            overflowY: "hidden"
        });
    }

    if ($videoPopup.length > 0) {
        $videoPopup.magnificPopup({
            type: "iframe",
            removalDelay: 300,
            mainClass: "mfp-fade",
            overflowY: "hidden",
            iframe: {
                markup: '<div class="mfp-iframe-scaler">'+
                    '<div class="mfp-close"></div>'+
                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                    '</div>',
                patterns: {
                    youtube: {
                        index: 'youtube.com/',
                        id: 'v=',
                        src: '//www.youtube.com/embed/%id%?autoplay=1'
                    },
                    vimeo: {
                        index: 'vimeo.com/',
                        id: '/',
                        src: '//player.vimeo.com/video/%id%?autoplay=1'
                    },
                    gmaps: {
                        index: '//maps.google.',
                        src: '%id%&output=embed'
                    }
                },
                srcAction: 'iframe_src'
            }
        });
    }

    jQuery(document).keydown(function(e) {
        if( $body.hasClass("show-off-screen-content") ){
            switch(e.which) {
                case 27: // ESC
                    jQuery(".nav-btn").trigger("click");
                    break;
            }
        }
    });

/*
//  Responsive Video Scaling

    if (jQuery(".video").length > 0) {
        jQuery(this).fitVids();
    }

*/
	
//  Form Validation

    jQuery(".form .btn[type='submit']").on("click", function(){
        var button = jQuery(this);
        var form = jQuery(this).closest("form");
        button.prepend("<div class='status'></div>");
        form.validate({
            submitHandler: function() {
                $.post("assets/php/email.php", form.serialize(),  function(response) {
                    button.find(".status").append(response);
                    form.addClass("submitted");
                });
                return false;
            }
        });
    });

    jQuery(".slider-pager").owlCarousel({
        autoWidth: true,
        margin: 2
    });

    drawScrollbar();

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// On Load
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

jQuery(window).on("load", function(){
    jQuery(".animate").addClass("in");

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function simpleMap(latitude, longitude, markerImage, mapTheme, mapElement){

    if ( mapTheme === "light" ){
        var mapStyles = [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}];
    }
    else if ( mapTheme === "dark" ){
        mapStyles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
    }
    var mapCenter = new google.maps.LatLng(latitude,longitude);
    var mapOptions = {
        zoom: 13,
        center: mapCenter,
        disableDefaultUI: true,
        scrollwheel: false,
        styles: mapStyles
    };
    var element = document.getElementById(mapElement);
    var map = new google.maps.Map(element, mapOptions);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude,longitude),
        map: map,
        icon: markerImage
    });
}

if(!jQuery("body").hasClass("iframe-page")){
	var viewport = (function() {
		var viewPorts = ['xs', 'sm', 'md', 'lg'];

        var viewPortSize = function() {
            return window.getComputedStyle(document.body, ':before').content.replace(/"/g, '');
        };

        var is = function(size) {
            if ( viewPorts.indexOf(size) === -1 ) throw "no valid viewport name given";
            return viewPortSize() === size;
        };

        var isEqualOrGreaterThan = function(size) {
            if ( viewPorts.indexOf(size) === -1 ) throw "no valid viewport name given";
            return viewPorts.indexOf(viewPortSize()) >= viewPorts.indexOf(size);
        };

        // Public API
        return {
            is: is,
            isEqualOrGreaterThan: isEqualOrGreaterThan
        }

	})();
}

function drawScrollbar(){
    jQuery(".iframe-page .page-wrapper").addClass("scrollbar-inner");
    jQuery(".iframe-page .scrollbar-inner").scrollbar();
}