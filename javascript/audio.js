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
var AudioSound = require('./AudioSound').AudioSound;
var TrackView = require('./TrackView').TrackView;


var audioContext = AudioContext.create();



function log(msg) {
	console.log(msg);
}



var cSound, dSound, eSound, fSound, gSound;

var audioTrack = new AudioTrack({bars:2, beatCallback:beatCallback, stopCallback:stopAudioTrack});

function beatCallback() {
    cSound.play();
}

function stopAudioTrack(at) {
    var track = at.getTrack();

    var w = $('#recorder-svg').attr('width');
    var h = $('#recorder-svg').attr('height');
    var trackView = new TrackView({width:w, height:h});
    var view = trackView.convert(track);

    view.forEach( function(n) {
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); 
        for (var attrib in n) {
            newElement.setAttribute(attrib, n[attrib]);
        }

        $('#recorder-svg').append(newElement);
    })

/*    $(newElement).attr("x", "200");
    $(newElement).attr("y", "0");
    $(newElement).attr("width", "200");
    $(newElement).attr("height", "70");
    $(newElement).attr("full", "blue");
*/


}


function handleKeySound(selector, sound) {
	$(selector).on("touchstart mousedown", function(ev) {
		ev.preventDefault();
		sound.play();
	});

	$(selector).on("touchend mouseup", function(ev) {
		ev.preventDefault();
		sound.stop();
	});
}


function handleKeySound(selector, sound, handlerOn, handlerOff) {
    $(selector).on("touchstart mousedown", function(ev) {
        ev.preventDefault();
        sound.play();
    if (handlerOn){
      handlerOn(sound);
    }
    });

    $(selector).on("touchend mouseup", function(ev) {
        ev.preventDefault();
        sound.stop();
    if (handlerOff) {
      handlerOff(sound);
    }
    });
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

//    var recorder = new DrawRecorder(4000);  // 4 sec.
//    recorder.start();

    $('#recorder-svg').empty();

    $('#draw').append('<svg:rect width:50 height:30 />');
    audioTrack.start();

    console.log("record");
}
 
function handlePlay(ev) {
    ev.preventDefault();


//    var track = audioTrack.getTrack();
//    playTrack(track)
}


function playTrack(track) {
    track.forEach( function(note) {
        console.log(note);
        cSound.playSound(note.start/1000, note.width/1000);
    });
}
function handleOn() {
    if (audioTrack.recording) {
        audioTrack.on();
    }
}


function handleOff() {
    if (audioTrack.recording) {
        audioTrack.off();
    }
}


function initialize() {
	cSound = new AudioSound(audioContext, {url:'sound/c.wav'});
	dSound = new AudioSound(audioContext, {url:'sound/d.wav'});
	eSound = new AudioSound(audioContext, {url:'sound/e.wav'});
	fSound = new AudioSound(audioContext, {url:'sound/f.wav'});
	gSound = new AudioSound(audioContext, {url:'sound/g.wav'});

    handleKeySound('#ckey', cSound, handleOn, handleOff);
    handleKeySound('#dkey', dSound, handleOn, handleOff);
    handleKeySound('#ekey', eSound, handleOn, handleOff);
    handleKeySound('#fkey', fSound, handleOn, handleOff);
    handleKeySound('#gkey', gSound, handleOn, handleOff);    

    $('#record').on("touchstart click", handleRecord);
    $('#play').on("touchstart click", handlePlay);

//    handleKey('#ckey', handleOn, handleOff)

}

// document is reay 
$( function() {	


    initialize()});


