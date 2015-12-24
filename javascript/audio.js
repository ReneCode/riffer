var audioContext = new AudioContext();

var soundBuffer = {};


function loadAudio( object, url) {

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            object.buffer = buffer;
        });
    }
    request.send();
}




function playAudio(context, object) {
    var s = context.createBufferSource();
    s.buffer = object.buffer;
    s.connect(context.destination);
    s.start(0);
    object.s = s;
}





function load_audio() {
	console.log("load");

	loadAudio(soundBuffer, 'irHall.ogg');
}

function play_audio() {
	console.log("play");
	playAudio(audioContext, soundBuffer);
}


