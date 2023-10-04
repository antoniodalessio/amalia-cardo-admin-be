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
});



$(document).ready(function(){
    
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
            }
    
            msg['g-recaptcha-response'] = formData[3].value
            $('.contactForm button').addClass("loading")
    
            $.ajax({
                url: 'https://www.amaliacardo.it/contact.php',
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
                        $('html,body').animate({ scrollTop: 0 }, 'slow');
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

})