const BaseAPI = 'https://0bkjxq5hf4.execute-api.us-west-2.amazonaws.com/develop'
const HighlightBoxClass = 'boxForWhatToRead'

function stopAll(){
    PlayerState.audioElement.pause();
    PlayerState.audioElement.addEventListener('ended',goNext);
}

function playAudioAndSyncText(){

}

let PlayerState = {
    current: 0,
    elementsToRead: [],
    playing: false,
    audioElement: null,
}

function setupPlayer(){
    const player = $(`
    <div id="player">
        <span class="player-btn" id="player-prev-btn">Prev</span>
        <span class="player-btn" id="player-play-btn">Play</span>
        <span class="player-btn" id="player-stop-btn">Stop</span>
        <span class="player-btn" id="player-next-btn">Next</span>
    </div>
    `).css({
        'display': 'flex',
        'justify-content':'space-evenly',
        'align-items': 'center',
        'background-color': '#f6f6ef88',
        'width': '480px',
        'height':'48px',
        'left': '50%',
        'position':'fixed',
        'bottom':'0px',
        'z-index': 99999999999999999
    });
    $('body').prepend(player);
    $('#player').css('left', parseInt($('#player').css('left').replace('px','')-240));
    PlayerState.current = 0;
    PlayerState.elementsToRead = [];
    PlayerState.playing = false;
    PlayerState.audioElement = document.createElement('audio');
    // setTimeout(()=>{$('#player-play-btn').click(PlayButtonClicked)}, 100)
    $('#player-play-btn').click(()=>PlayButtonClicked())
    $('#player-next-btn').click(()=>NextButtonClicked())
    $('#player-prev-btn').click(()=>PrevButtonClicked())
    $('#player-stop-btn').click(()=>StopButtonClicked())
    
}


function findElementToRead(){
    let elementsToRead = $('p,blockquote,h1,h2,h3,h4,h5');
    const indiciesToRemove = [];
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
    // end
    let temp = {}
    let maxIndex = 0
    // add and position play buttons and highlight boxes
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
        temp[index] = $(this)
        maxIndex = Math.max(index, maxIndex)
    });
    for (let i = 0;i <= maxIndex; i++){
        if (temp[i]){
            PlayerState.elementsToRead.push(temp[i])
        }
    }
}

function StopButtonClicked(){

    console.log('stop')
    // play(PlayerState.elementsToRead[PlayerState.current])
    stopAll()
}


function PlayButtonClicked(){
    // for (let i = 0; i < PlayerState.elementsToRead.length; i++){
    //     console.log(PlayerState.elementsToRead[i].text())
    // }
    console.log('playing', PlayerState.current)
    play(PlayerState.elementsToRead[PlayerState.current])
}

function NextButtonClicked(andPlay = false){
    if(PlayerState.current < PlayerState.elementsToRead.length - 1){
        PlayerState.current++
        HighlightCurrent()
        if(andPlay){
            PlayButtonClicked()
        }
    }
}

function PrevButtonClicked(){
    if(PlayerState.current > 0){
        PlayerState.current--
    }
    HighlightCurrent()
}

function HighlightCurrent(){
    for(let i = 0;i < PlayerState.elementsToRead.length; i++){
        PlayerState.elementsToRead[i].removeClass(HighlightBoxClass);
    }
    window.scrollTo(0, Math.max(PlayerState.elementsToRead[PlayerState.current].offset().top - 340, 0));
    PlayerState.elementsToRead[PlayerState.current].addClass(HighlightBoxClass);
}

function goNext(){
    NextButtonClicked(andPlay=true);
}

function play(jqObject){
    stopAll()
    console.log('playing', jqObject.text())    
    rb = {
        text: jqObject.text(),
        page: window.location.href,
        voice: 'voice_id_1',
        token: 'HFSk2a87gkR3yFW8ntNamUvi' 
    }
    console.log(JSON.stringify(rb))
    $.post(BaseAPI, JSON.stringify(rb)).done((data)=>{
        console.log(data)
        const soundUrl = data['audio_link']
        PlayerState.audioElement.setAttribute('src', soundUrl);
        PlayerState.audioElement.addEventListener('ended', goNext);
        PlayerState.audioElement.addEventListener("canplay",function(){
            // $("#length").text("Duration:" + audioElement.duration + " seconds");
            // $("#source").text("Source:" + audioElement.src);
            // $("#status").text("Status: Ready to play").css("color","green");
            PlayerState.audioElement.play();
        });
        
        PlayerState.audioElement.addEventListener("timeupdate",function(){
            // $("#currentTime").text("Current second:" + PlayerState.audioElement.currentTime);
        });

        // var element = document.getElementById("main-player");
        // console.log(element)
        // if (element != null){
        //     console.log(element.pause)
        //     element.pause()
        //     element.parentNode.removeChild(element);
        // }
        
        // player = document.getElementById("main-player");
        // console.log(player);
        // player.src = browser.runtime.getURL(soundUrl);
        // player.play();
    }).fail((jqXHR, textStatus, errorThrown)=>{
        console.log(jqXHR.responseJSON);
        console.error("error", textStatus)
        console.error("error", errorThrown)
    })
    // SOUND_URL = 'https://test-to-learn-tts-vahid.s3.us-west-2.amazonaws.com/0af1704d-607c-4b4d-8d86-97af96ad6193.mp3'
    // $('body').append('<audio xmlns="http://www.w3.org/1999/xhtml" id="clickSound" src="https://test-to-learn-tts-vahid.s3.us-west-2.amazonaws.com/0af1704d-607c-4b4d-8d86-97af96ad6193.mp3" />')
}

$( document ).ready(function(){
    // a function to define css classes dynamically
    function addCssRule(rule, css) {
        css = JSON.stringify(css).replace(/"/g, "").replace(/,/g, ";");
        $("<style>").prop("type", "text/css").html(rule + css).appendTo("head");
    }

    addCssRule('.'+HighlightBoxClass,{
        'background-color':'#35a1e822',
        'border': '6px solid rgba(53, 161, 232, .12)',
        'border-radius': '6px',
        '-webkit-background-clip': 'padding-box', /* for Safari */
        'background-clip': 'padding-box' /* for IE9+, Firefox 4+, Opera, Chrome */
    });
    
    if (window.hasRun){
        return;
    }
    window.hasRun = true;

    // this is temp
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
    // if (whiteListLinks.indexOf(window.location.href) == -1){
    //     return;
    // }

    setupPlayer();
    findElementToRead();
    setTimeout(HighlightCurrent, 100);

    let player = document.createElement("audio");
    player.setAttribute('id', 'main-player');
});
