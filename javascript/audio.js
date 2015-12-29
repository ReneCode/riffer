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



function log(msg) {
	console.log(msg);
}



function AudioSound(context, url) {

    var soundBuffer,
        soundSource,
        gainNode;

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
    function playSound() {
        // play the source now
        soundSource = context.createBufferSource();
        soundSource.buffer = soundBuffer;
        gainNode = context.createGain();
        soundSource.connect(gainNode);
        gainNode.connect(context.destination);
	    soundSource.start(context.currentTime, 0.4, 1);
    }

    function stopSound() {
        // stop the source now
        var tim = context.currentTime;
        gainNode.gain.value = 0.1;
//        gainNode.gain.linearRampToValueAtTime(0);
//        soundSource.stop(context.currentTime);
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
	$(selector).on("touchstart mousedown", function(ev) {
		ev.preventDefault();
		sound.playSound();
	});

	$(selector).on("touchend mouseup", function(ev) {
		ev.preventDefault();
		sound.stopSound();
	});

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

