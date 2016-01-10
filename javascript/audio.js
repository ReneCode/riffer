/*
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
*/

var AudioContext = require('./audioContext')
var AudioTrack = require('./audioTrack').AudioTrack;


var audioContext = AudioContext.create();



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
    function playSound(offset, duration) {
        // play the source now
        if (!offset) {
            offset = 0;
        }
        if (!duration) {
            duration = 10;
        }
        soundSource = context.createBufferSource();
        soundSource.buffer = soundBuffer;
        gainNode = context.createGain();
        soundSource.connect(gainNode);
        gainNode.connect(context.destination);
	    soundSource.start(context.currentTime+offset, 0, duration); // , 0.4, 1);
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

var audioTrack = new AudioTrack();

function handleKeySound(selector, sound) {
	$(selector).on("touchstart mousedown", function(ev) {
		ev.preventDefault();
		sound.playSound();
	});

	$(selector).on("touchend mouseup", function(ev) {
		ev.preventDefault();
		sound.stopSound();
	});
}


function handleKey(selector, handlerOn, handlerOff) {
    if (handlerOn != undefined) {
        $(selector).on("touchstart mousedown", function(ev) {
            ev.preventDefault();
            handlerOn();
        });            
    } 


    if (handlerOff != undefined) {
        $(selector).on("touchend mouseup", function(ev) {
            ev.preventDefault();
            handlerOff();
        });            
    } 
}

function DrawRecorder(len) {
    var self = this;

    this.len = len;
    this.interval = 50;        
    this.maxTick = len / this.interval;
    
    this.start = function() {
        this.countTick = 0;
        this.idInterval = setInterval(this.tick, this.interval);
    };

    this.tick = function() {
        self.countTick++;
        if (self.countTick <= self.maxTick) {
            self.draw();
        } else {
            clearInterval(self.idInterval);
        }
    };

    this.draw = function() {
        $svg = $("#recorder-svg")[0];
        $("#recorder-arrow", $svg).attr("x", self.countTick*3);
    };
};

function handleRecord(ev) {
    ev.preventDefault();

    var recorder = new DrawRecorder(4000);  // 4 sec.
    recorder.start();

    audioTrack.start();

    console.log("record");
}
 
function handlePlay(ev) {
    ev.preventDefault();

    var track = audioTrack.getTrack();
    playTrack(track)
}


function playTrack(track) {
    track.forEach( function(note) {
        console.log(note);
        cSound.playSound(note.start/1000, note.width/1000);
    });
}
function handleOn() {
    audioTrack.on();
}


function handleOff() {
    audioTrack.off();
}

function initialize() {
	cSound = new AudioSound(audioContext, 'sound/c.wav');
	dSound = new AudioSound(audioContext, 'sound/d.wav');
	eSound = new AudioSound(audioContext, 'sound/e.wav');
	fSound = new AudioSound(audioContext, 'sound/f.wav');
	gSound = new AudioSound(audioContext, 'sound/g.wav');

	handleKeySound('#ckey', cSound);
	handleKeySound('#dkey', dSound);
	handleKeySound('#ekey', eSound);
	handleKeySound('#fkey', fSound);
	handleKeySound('#gkey', gSound);

    $('#record').on("touchstart click", handleRecord);
    $('#play').on("touchstart click", handlePlay);

    handleKey('#ckey', handleOn, handleOff)

}

// document is reay 
$( function() {	


    initialize()});


