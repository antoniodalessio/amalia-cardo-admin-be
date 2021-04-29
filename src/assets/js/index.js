$(document).ready(function(){
    $('body').addClass('ready')
    $('.category-menu li a').on('click', function(e) {
        e.preventDefault()
        $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top},'slow');
    })
})

$(window).on("load", function(){
	$('body').addClass('loaded')
})


