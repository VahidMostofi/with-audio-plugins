// const request = require("request");

(function(){
    // const Request = require("sdk/request").Request;
    const highlight = {
        'display': 'inline',
        'padding': '.25em 0',
        'background': '#FFC107',
        'color': '#ffffff',
        'box-shadow': '.5em 0 0 #FFC107, -.5em 0 0 #FFC107'
    }

    if (window.hasRun){
        return;
    }
    window.hasRun = true;
    const whiteListLinks = [
        'https://masterwp.com/5-things-id-want-to-see-improved-in-wordpress-core/',
        'https://news.ycombinator.com/',
        'http://etherrotmutex.blogspot.com/2017/07/what-are-odds-that-some-idiot-will-name.html',
        'https://www.freightwaves.com/news/thefts-of-powertrain-modules-plague-daimler-truck',
        'https://benn.substack.com/p/the-end-of-big-data?s=r',
        'https://www.forbes.com/sites/alexkonrad/2022/05/26/stripe-exclusive-interview-collison-brothers-95-billion-plan-to-stay-on-top/?sh=344ed7ea5a1b',
        'https://cloud.google.com/blog/products/databases/alloydb-for-postgresql-columnar-engine',
        'https://www.perceptivetravel.com/issues/1218/kelly.html',
        'https://esphome.io/index.html',

    ]
    if (whiteListLinks.indexOf(window.location.href) == -1){
        return;
    }

    $('body').prepend(`
        <div style="background-color:#fffb00;width:100%;position:sticky;top:10px;">VAHIDDD</div>
    `); 

    $('.athing').each(function(){
        console.log($(this).text());
    });

    let elementsToRead = $('p,blockquote,h1,h2,h3,h4,h5');
    const indiciesToRemove = [];
    console.log('elementsToRead',elementsToRead.length);
    elementsToRead.each(function(index){
        for (let i = 0;i < elementsToRead.length; i++){
            if($(this).find(elementsToRead[i]).length > 0){
                indiciesToRemove.push(i);
                break;
            }
            if($(this).text().length == 0){
                indiciesToRemove.push(i);
                break;
            }
        }
    });
    console.log('elmentsToRead', elementsToRead.length);

    elementsToRead.each(function(index){
        if (indiciesToRemove.indexOf(index) > -1){
            return
        }
        if($(this).text().length == 0){
            return
        }
        if($(this).closest('form, fieldset, object, embed, footer, link, aside').length > 0){
            return
        }
        $(this).css({
            'background-color':'#35a1e844',
            'border': '6px solid rgba(53, 161, 232, .25)',
            'border-radius': '6px',
            '-webkit-background-clip': 'padding-box', /* for Safari */
            'background-clip': 'padding-box' /* for IE9+, Firefox 4+, Opera, Chrome */
        });
        const playButton = $('<div>Play</div>');
        playButton.css({
            'position':'absolute',
            'top':$(this).offset().top,
            'left':$(this).offset().left-50,
            'width': 'auto',
            'height': '25px',
            'background-color': '#46b2f955',
        }).attr(
            'whatToRead',index
        ).click(()=>{
            console.log($(this).text())
            rb = {
                text: $(this).text(),
                link: window.location.href,
                voice: 'like it matters!',
                token: 'you are secure' 
            }
            $.post("http://localhost:8080/",JSON.stringify(rb),).done((data)=>{
                console.log(data)
            }).fail((err)=>{
                // alert(JSON.stringify(data));
                console.error("error", err)
            })

            // const request = new Request('http://localhost:8080', {method: 'POST', body: JSON.stringify(rb)});
            // fetch(request)
            // .then(response => {
            //     if (response.status === 200) {
            //         return response.json();
            //     } else {
            //         throw new Error('Something went wrong on API server!');
            //     }
            // })
            // .then(response => {
            //     console.debug(response);
            //     alert(response)
            // }).catch(error => {
            //     console.error(error);
            // });

        });
        $('body').append(playButton);
    });
})();