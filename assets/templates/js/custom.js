$(document).ready(function(){

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
     console.log('this is a touch device');
    } else {
     document.body.classList.add('no-touch');
    }
    
    // Map google
    $('.overlay-map').click(function() {
	   $(this).remove();
	});
     
    // Table-responsive
    $('table').resTables();
     
    // Navigation
    $('.slimmenu').slimmenu({
        resizeWidth: '1200'
    });
    
    //Autoheight
    $('.box').AutoHeight()
    
    // Jacor
    $('a[href^="#"], *[data-href^="#"]').on('click', function(e){
        e.preventDefault();
        var t = 1000;
        var d = $(this).attr('data-href') ? $(this).attr('data-href') : $(this).attr('href');
        $('html,body').stop().animate({ scrollTop: $(d).offset().top }, t);
    });
    
    // Modal forms subject
    $(".form-modal-overlay").css({backgroundColor: 'rgba(0,0,0,.9)'});
    $(function () { // вся мaгия пoсле зaгрузки стрaницы
        $('.btn-mobal').click(function (event) { // лoвим клик пo ссылки с class="modal"
            event.preventDefault(); // выключaем стaндaртную рoль элементa
            if ($(this).next('.form-modal-overlay').size()) {
                var form_modal_overlay = $(this).next('.form-modal-overlay');
            } else {
                var form_modal_overlay = $('.wrapper .form-modal-overlay');
            }
            form_modal_overlay.fadeIn(400, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
                function () { // пoсле выпoлнения предъидущей aнимaции
                    $('.form-modal-body').css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
                        .animate({opacity: 1, top: '50%'}, 300); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
                });
        });
        /* Зaкрытие мoдaльнoгo oкнa, тут делaем тo же сaмoе нo в oбрaтнoм пoрядке */
        $('.modal-close').click(function () { // лoвим клик пo крестику или пoдлoжке
            $('.form-modal-body').animate({opacity: 0, top: '0'}, 300, // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
                function () { // пoсле aнимaции
                    $(this).css('display', 'none'); // делaем ему display: none;
                    $('.form-modal-overlay').fadeOut(400); // скрывaем пoдлoжку
                }
            );
        });
    });
    // END MODAL FORM
    
    
    // Accordion
    var acc = document.getElementsByClassName("accordion-permanent");
    var i;
    
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
    }
    
    // Open panel menu
    function resize_menu(){
        var mql1200 = window.matchMedia("screen and (min-width: 1200px)");
    	if(!mql1200.matches){
                jQuery(".tel-append").prependTo(".cd-panel-tel");
    	}
        else {
                jQuery(".tel-append").prependTo(".colum-header-tel");
        }
    }

    $(window).resize(function(){
        resize_menu();
    });
    $(window).resize();
    $(window ).load(function() {
    $(window).resize();
    });

 
});

/*GOOGLE MAP*/
function initMap() {
  //Местоположение: долгота, широта и коэффициент увеличения
  var latitude = 55.809316,
    longitude = 37.836699,
    map_zoom = 17;
  //Адрес до иконки с маркером
  var marker_url = '/images/design/map-marker.png';

  var main_color = '#e9e9e9', //основной цвет карты
    saturation_value = -1, //насыщенность
    brightness_value = 1; //яркость 

  //Стили для элементов на карте
  var style = [
    { featureType: "all", elementType: "geometry", stylers: [{ visibility: "on" }] },
    { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#e7e7e7" }, { visibility: "on" }] },
    { featureType: "landscape.natural.landcover.fill", elementType: "geometry.fill", stylers: [{ saturation: "-100" }, { visibility: "on" }] },
    { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#d4d3d3" }, { visibility: "on" }] },
    // цвет текста улиц и номеров
    { elementType: 'labels.text.fill', stylers: [{ color: "#000000" }] },
    // убрать цвет маркеров различных обьектов (обесцветить)
    { featureType: "poi", elementType: "labels.icon", stylers: [{ saturation: "-100" }] },
    // цвет текста для маркеров
    { featureType: "poi", elementType: 'labels.text.fill', stylers: [{ color: "#000000" }] },
    // все промежуточные остановки и маршруты общественного транспорта
    { featureType: "transit", elementType: "geometry.fill", stylers: [{ hue: main_color }, { "visibility": "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ saturation: "-100" }] },
    // дороги
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#FFFFFF" }, { visibility: "on" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#F3F3F3" }, { visibility: "on" }] },
    //{ featureType: "road", elementType: "labels", stylers: [{ "visibility": "off" }] },
    // вода
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#FBFBFB" }, { visibility: "on" }] }
    // документация https://developers.google.com/maps/documentation/javascript/style-reference?hl=ru
    //https://mapstyle.withgoogle.com/
  ];

  //Создание точки на карте 
  var map_options = {
    center: new google.maps.LatLng(latitude, longitude),
    zoom: map_zoom,
    panControl: false,
    //zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    styles: style
  }
  //Инициализация карты
  var map = new google.maps.Map(document.getElementById('google-container'), map_options);
  //Добавляем свой маркер местонахождения на карту (свою иконку)      
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(latitude, longitude),
    map: map,
    title: 'Bust Club',
    visible: true,
    icon: marker_url
  });
}

/*AjaxForm*/

var AjaxForm={initialize:function(e){jQuery().ajaxForm||document.write('<script src="'+e.assetsUrl+'js/lib/jquery.form.min.js"></script>'),jQuery().jGrowl||document.write('<script src="'+e.assetsUrl+'js/lib/jquery.jgrowl.min.js"></script>'),$(document).ready(function(){$.jGrowl.defaults.closerTemplate="<div>[ "+e.closeMessage+" ]</div>"}),$(document).off("submit",e.formSelector).on("submit",e.formSelector,function(r){return $(this).ajaxSubmit({dataType:"json",data:{pageId:e.pageId},url:e.actionUrl,beforeSerialize:function(e){e.find(":submit").each(function(){e.find('input[type="hidden"][name="'+$(this).attr("name")+'"]').length||$(e).append($('<input type="hidden">').attr({name:$(this).attr("name"),value:$(this).attr("value")}))})},beforeSubmit:function(e,r){return"undefined"!=typeof afValidated&&0==afValidated?!1:(r.find(".error").html(""),r.find(".error").removeClass("error"),r.find("input,textarea,select,button").attr("disabled",!0),!0)},success:function(e,r,t,s){if(s.find("input,textarea,select,button").attr("disabled",!1),e.form=s,$(document).trigger("af_complete",e),e.success)AjaxForm.Message.success(e.message),s.find(".error").removeClass("error"),s[0].reset(),"undefined"!=typeof grecaptcha&&grecaptcha.reset();else if(AjaxForm.Message.error(e.message),e.data){var a,o,n;for(a in e.data)e.data.hasOwnProperty(a)&&(n||(s.find('[name="'+a+'"]').focus(),n=!0),o=e.data[a],s.find(".error_"+a).html(o).addClass("error"),s.find('[name="'+a+'"]').addClass("error"))}}}),r.preventDefault(),!1}),$(document).on("keypress change",".error",function(){var e=$(this).attr("name");$(this).removeClass("error"),$(".error_"+e).html("").removeClass("error")}),$(document).on("reset",e.formSelector,function(){$(this).find(".error").html(""),AjaxForm.Message.close()})}};AjaxForm.Message={success:function(e,r){e&&(r||(r=!1),$.jGrowl(e,{theme:"af-message-success",sticky: true}))},error:function(e,r){e&&(r||(r=!1),$.jGrowl(e,{theme:"af-message-error",sticky:r}))},info:function(e,r){e&&(r||(r=!1),$.jGrowl(e,{theme:"af-message-info",sticky:r}))},close:function(){$.jGrowl("close")}};

/*easycomm*/
var easyComm={initialize:function(){jQuery().ajaxForm||easyComm.notice.error("Can`t find jQuery ajaxForm plugin!"),easyComm.rating.initialize(),jQuery(document).on("submit","form.ec-form",function(e){return easyComm.message.send(this),e.preventDefault(),!1})},message:{send:function(e){jQuery(e).ajaxSubmit({data:{action:"message/create"},url:easyCommConfig.actionUrl,form:e,dataType:"json",beforeSubmit:function(){return jQuery(e).find('input[type="submit"]').attr("disabled","disabled"),jQuery(e).find(".has-error").removeClass("has-error"),jQuery(e).find(".ec-error").text("").hide(),!0},success:function(t){var a=jQuery(e).data("fid");jQuery(e).find('input[type="submit"]').removeAttr("disabled"),t.success?(jQuery(e)[0].reset(),"string"==typeof t.data?(jQuery("#ec-form-success-"+a).html(t.data),jQuery(e).hide()):easyComm.notice.show(t.message)):t.data&&t.data.length?jQuery.each(t.data,function(t,r){jQuery(e).find('[name="'+r.field+'"]').closest(".form-group").addClass("has-error"),jQuery(e).find("#ec-"+r.field+"-error-"+a).text(r.message).show().closest(".form-group").addClass("has-error")}):easyComm.notice.error(t.message)},error:function(){jQuery(e).find('input[type="submit"]').removeAttr("disabled"),easyComm.notice.error("Submit error")}})}},rating:{initialize:function(){var e=jQuery(".ec-rating").find(".ec-rating-stars>span");e.on("touchend click",function(e){var t=jQuery(this).data("description");jQuery(this).parent().parent().find(".ec-rating-description").html(t).data("old-text",t),jQuery(this).parent().children().removeClass("active active2 active-disabled"),jQuery(this).prevAll().addClass("active"),jQuery(this).addClass("active");var a=jQuery(this).closest(".ec-rating").data("storage-id");jQuery("#"+a).val(jQuery(this).data("rating"))}),e.hover(function(){var e=jQuery(this).parent().parent().find(".ec-rating-description");e.data("old-text",e.html()),e.html(jQuery(this).data("description")),jQuery(this).addClass("active2").removeClass("active-disabled"),jQuery(this).prevAll().addClass("active2").removeClass("active-disabled"),jQuery(this).nextAll().removeClass("active2").addClass("active-disabled")},function(){var e=jQuery(this).parent().parent().find(".ec-rating-description");e.html(e.data("old-text")),jQuery(this).parent().children().removeClass("active2 active-disabled")})}},notice:{error:function(e){alert(e)},show:function(e){alert(e)}}};jQuery(document).ready(function(){easyComm.initialize()});var easyCommReCaptchaCallback=function(){"undefined"!=typeof grecaptcha?$(".ec-captcha").each(function(e){grecaptcha.render($(this).attr("id"),{sitekey:easyCommConfig.reCaptchaSiteKey})}):easyComm.notice.error("grecaptcha is not defined!")};

/*ms2Gallery*/
var ms2Gallery={initialize:function(selector){var galleries=$(selector);if(!galleries.length){return false;}if($(document).find('.fotorama').length){this.fotorama();}galleries.each(function(){var gallery=$(this);if(gallery.hasClass('fotorama')){return;}var thumbnails=gallery.find('.thumbnail');thumbnails.on('click',function(e){e.preventDefault();thumbnails.removeClass('active');var thumbnail=$(this);thumbnail.addClass('active');var main=gallery.find('#mainImage, .mainImage');main.attr('src',thumbnail.attr('href'));main.parent().attr('href',thumbnail.data('image'));var image=$(this).find('img');if(image.length){main.attr('title',image[0].title).attr('alt',image[0].alt);}return false;});gallery.find('.thumbnail:first').click();});return true;},fotorama:function(){$('<link/>',{rel:'stylesheet',type:'text/css',href:ms2GalleryConfig.cssUrl+'lib/fotorama.min.css',}).appendTo('head');$('<script/>',{type:'text/javascript',src:ms2GalleryConfig.jsUrl+'lib/fotorama.min.js',}).appendTo('head');}};$(document).ready(function(){ms2Gallery.initialize('#msGallery, .ms2Gallery');});
