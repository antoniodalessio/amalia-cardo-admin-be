$.extend($.validator.messages, {
	required: "Campo obbligatorio",
	remote: "Controlla questo campo",
	email: "Inserisci un indirizzo email valido",
	url: "Inserisci un indirizzo web valido",
	date: "Inserisci una data valida",
	dateISO: "Inserisci una data valida (ISO)",
	number: "Inserisci un numero valido",
	digits: "Inserisci solo numeri",
	creditcard: "Inserisci un numero di carta di credito valido",
	equalTo: "Il valore non corrisponde",
	extension: "Inserisci un valore con un&apos;estensione valida",
	maxlength: $.validator.format("Non inserire pi&ugrave; di {0} caratteri"),
	minlength: $.validator.format("Inserisci almeno {0} caratteri"),
	rangelength: $.validator.format("Inserisci un valore compreso tra {0} e {1} caratteri"),
	range: $.validator.format("Inserisci un valore compreso tra {0} e {1}"),
	max: $.validator.format("Inserisci un valore minore o uguale a {0}"),
	min: $.validator.format("Inserisci un valore maggiore o uguale a {0}"),
	nifES: "Inserisci un NIF valido",
	nieES: "Inserisci un NIE valido",
	cifES: "Inserisci un CIF valido",
	currency: "Inserisci una valuta valida"
})


function initContactForm() {
    var $form = $('.contactForm');
    var $infoMessage = $form.find('.info-message')
    var $successMsg = $('.success-message');

    $form.validate({
        lang : 'it',
        submitHandler: function(form) {
            var formData = $form.serializeArray();

            var msg = {
                name: formData[0].value,
                email: formData[1].value,
                message: formData[2].value,
                productId: formData[5].value
            }
    
            msg['g-recaptcha-response'] = formData[3].value
            $('.contactForm button').addClass("loading")
    
            $.ajax({
                url: 'http://lianto.ns0.it:15645/public/contact',
                type: 'POST',
                data: JSON.stringify(msg),
                contentType: 'application/json',
                dataType: "json",
                success: function(response) {
                    if (response.result) {
                        $('.contactForm button').removeClass("loading")
                        $successMsg.text("Grazie. Richiesta inviata con successo. A breve riceverai una email di conferma.")
                        $form.slideUp();
                        $successMsg.slideDown();
                    }else{
                        $('.contactForm button').removeClass("loading")
                        $infoMessage.text("La tua richiesta non è andata a buon fine. Controlla il campo email o il captcha").css({color: '#cc0000'})
                    }
                },
                error: function(e) {
                    $('.contactForm button').removeClass("loading")
                    $infoMessage.text("La tua richiesta non è andata a buon fine. Controlla il campo email o il captcha").css({color: '#cc0000'})
                }
            })
          
        }
       });  

} 

function relatedLabel() {
    var offsetThumbButton = $('.thumb-list__link').position().top
    
    if ($(window).scrollTop() > offsetThumbButton - 1000) {
        $('.related-label').addClass('visible')
    }else{
        $('.related-label').removeClass('visible')
    }
}


$(document).ready(function(){
	$('.thumb-list:not(.thumb-list__link)').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
      titleSrc: function(item) {
        return item.el.attr('title') + '<small>Amalia Cardo</small>';
      }
    }
  });

  initContactForm()
  console.log("releatedLabel init")
  $(window).on('scroll', function() {
    relatedLabel()
  })
  

});
