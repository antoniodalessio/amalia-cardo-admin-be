$(document).ready(function(){

    var $buttons = $('.popup-container header a')
    var $tabConents = $('.popup-container section')

    $buttons.on('click', function(e){
        e.stopPropagation()
        e.preventDefault()
        $tabConents.hide()
        $tabConents.eq($(this).index()).show()
        $buttons.removeClass("active")
        $(this).addClass("active")
    })

    // $tabConents.on('click', function(e) {
    //     e.stopPropagation()
    // })

    $tabConents.find('img').each(function(item){

        var bigImg = $(this).attr('src').replace('_thumb', '_x2')
        
        if ($(window).width() > 1024) {
            $(this)
            .parent()
            .zoom({url: bigImg, magnify: 1.4});
         }
    })


})