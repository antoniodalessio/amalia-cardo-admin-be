const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
var fs = require('fs');

(async() => {
    let files = fs.readdirSync("site/images/work/")

    for (const file of files) {
        console.log(file)
        await imagemin(
            [`site/images/work/${file}`, 'img/*.jpg'],
            {
                destination: 'site/img/',
                plugins: [imageminMozjpeg({quality: 65})]
            }
        );
    }
        

        


    
    
    
        
 
})();