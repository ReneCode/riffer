// search for a compa
var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false; 

if (AudioContext) {
    // Do whatever you want using the Web Audio API
    var audioContext = new AudioContext;
    // ...
} else {
    // Web Audio API is not supported
    // Alert the user
    alert("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
}

/*
// Step 1 - Initialise the Audio Context
// There can be only one!
function init() {
    if (typeof AudioContext !== "undefined") {
        context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
        context = new webkitAudioContext();
    } else {
        throw new Error('AudioContext not supported. :(');
    }
}

*/

function log(msg) {
	console.log(msg);
}



function AudioSound(context, url) {

    var soundBuffer,
        soundSource;

    // Step 2: Load our Sound using XHR
    function loadSound() {
        // Note: this loads asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        // Our asynchronous callback
        request.onload = function() {
        	context.decodeAudioData(request.response, function(buffer) {
        		soundBuffer = buffer;
        	});
        };

        request.send();
    }

    // Finally: tell the source when to start
    function playSound(ev) {
        // play the source now
        soundSource = context.createBufferSource();
        soundSource.buffer = soundBuffer;
        soundSource.connect(context.destination);
	    soundSource.start(0);
    }

    function stopSound(ev) {
        // stop the source now
        soundSource.stop();
    }



    loadSound();

    return {
    	playSound: playSound,
    	stopSound: stopSound
    }

}


var cSound, dSound, eSound, fSound, gSound;




function handleEnd() {
	soundC.stopSound();
}
function handle(selector, sound) {
	$(selector).on("touchstart", sound.playSound );
	$(selector).on("mousedown", sound.playSound );

	$(selector).on("touchend", sound.stopSound );
	$(selector).on("mouseup", sound.stopSound );

}

function initialize() {
	cSound = new AudioSound(audioContext, 'sound/c.wav');
	dSound = new AudioSound(audioContext, 'sound/d.wav');
	eSound = new AudioSound(audioContext, 'sound/e.wav');
	fSound = new AudioSound(audioContext, 'sound/f.wav');
	gSound = new AudioSound(audioContext, 'sound/g.wav');

	handle('#ckey', cSound);
	handle('#dkey', dSound);
	handle('#ekey', eSound);
	handle('#fkey', fSound);
	handle('#gkey', gSound);

}

// document is ready 
$( function() {
	initialize()
});

