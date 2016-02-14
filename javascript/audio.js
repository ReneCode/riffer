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


var svgns = "http://www.w3.org/2000/svg";
var xlinkns = 'http://www.w3.org/1999/xlink';

var AudioContext = require('./audioContext');
var AudioTrack = require('./audioTrack').AudioTrack;
var AudioSound = require('./audioSound').AudioSound;
var TrackView = require('./trackView').TrackView;
var AudioBeep = require('./audioBeep').AudioBeep;
var MessageList = require('./messageList').MessageList;

var audioContext = AudioContext.create();

function log(msg) {
	console.log(msg);
}


var messageList = new MessageList();
var /*cSound, dSound, eSound, fSound, gSound, */ beepSoundA, beepSoundB;
var soundInstrument = [];

var audioTrack = new AudioTrack({bpm:120, bars:1, beatsPerBar:4, _beatCallback:beatCallback, stopCallback:stopAudioTrack});


function getUserId() {
    var username = $('#username').val();
    if (!username) {
        username = "guest";
    }
    return username;
}


function beatCallback(first) {
    if (first) {
        beepSoundA.play();    
    } 
    else {
        beepSoundB.play();    
    }
 }

function showStatus(text) {
    $('#status').html(text);
}


function getDisplayDate(riff) {
    var dt = new Date(riff.date);
    return /*dt.toLocaleDateString() + " " + */ dt.toLocaleTimeString();
}

function displayTrackInSVG(svgSelector, track) {
    var w = $(svgSelector).attr('width');
    var h = $(svgSelector).attr('height');
    var trackView = new TrackView({width:w, height:h});
    var view = trackView.convert(track);

    view.forEach( function(n) {
        var newElement = document.createElementNS(svgns, 'rect'); 
        for (var attrib in n) {
            newElement.setAttribute(attrib, n[attrib]);
        }

        $(svgSelector).append(newElement);
    });
}

function displayRiffInSVG(svgSelector, riff) {
    displayTrackInSVG(svgSelector, riff.data);
    var newElement = document.createElementNS(svgns, 'text'); 
    newElement.setAttribute('x', '10');
    newElement.setAttribute('y', '20');
    newElement.innerHTML = riff.userid + " " + getDisplayDate(riff);
    $(svgSelector).append(newElement);

}

// get recorded Track and show it as SVG
function stopAudioTrack(at) {
    var track = at.getTrack();
    displayTrackInSVG('#recorder-svg', track);
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


function handleKeySound(selector, sound, note, handlerOn, handlerOff) {
    $(selector).on("touchstart mousedown", function(ev) {
        ev.preventDefault();
        sound.play();
    if (handlerOn){
      handlerOn(note);
    }
    });

    $(selector).on("touchend mouseup", function(ev) {
        ev.preventDefault();
        sound.stop();
    if (handlerOff) {
      handlerOff(note);
    }
    });
}



function startCursor() {
    var cursor = document.createElementNS(svgns, 'rect'); 
    cursor.setAttribute("x", 0);
    cursor.setAttribute("y", 0);
    cursor.setAttribute("width", 3);
    cursor.setAttribute("height", 100);
    cursor.setAttribute("fill", "orange");
    cursor.setAttribute("id", "cursor");

    $('#recorder-svg').append(cursor);
    $('.cursor').addClass('cursor');

}

function playTrack(track) {
    track.notes.forEach( function(note) {
        console.log(note);
        soundInstrument[note.note].play(note.start/1000, note.width/1000);
    });
}

function handleOn(note) {
    if (audioTrack.recording) {
        audioTrack.onNote(note);
    }
}


function handleOff(note) {
    if (audioTrack.recording) {
        audioTrack.offNote(note);
    }
}

function isMyRiff(riff) {
    return getUserId() == riff.userid;
}


function addTrackToDOM(riff)
{
    var idMsg = riff._id;
    var divId = 'msg' + idMsg;
    var svgId = 'svg' + idMsg;

    $('#messagelist').append( $('<div>')
        .addClass('message')
        .attr('id', divId)
    );

    var svgParent = document.createElementNS(svgns, 'svg'); 
    svgParent.setAttribute("width", 440);
    svgParent.setAttribute("height", 100);
    $('#' + divId).append(svgParent);

    var svg = document.createElementNS(svgns, 'svg'); 
    svg.setAttribute("class", 'msg-svg');
    svg.setAttribute("x", 20);
    svg.setAttribute("y", 0);
    svg.setAttribute("width", 400);
    svg.setAttribute("height", 100);
    svg.setAttribute("id", svgId);
    svgParent.appendChild(svg);

    var gradientId = '#other';
    var sayId = '#sayother';
    if (isMyRiff(riff)) {
        gradientId = '#me';
        sayId = '#sayme';
    }

    var use = document.createElementNS(svgns, 'use'); 
    // very important: use the xlink namespace !!
    use.setAttributeNS(xlinkns, "href", sayId);
    svgParent.appendChild(use);

    var rect = document.createElementNS(svgns, 'rect'); 
    rect.setAttribute("width", 400);
    rect.setAttribute("height", 100);
    rect.setAttribute("fill", "url('"+ gradientId + "')");
    svg.appendChild(rect);

    return '#' + svgId;
}


function handleRefresh(ev) {
    ev.preventDefault();

    reloadMessageList();
}


function handleRecord(ev) {
    ev.preventDefault();

    $('#recorder-svg').empty();
    startCursor();
    audioTrack.start();
}
 
function handlePlay(ev) {
    ev.preventDefault();
    var track = audioTrack.getTrack();
    startCursor();
    playTrack(track);
}

function handleSend(ev) {
    ev.preventDefault();
    if (!audioTrack.isEmpty()) {
        var track = audioTrack.getTrack();
        var userid = getUserId();
        messageList.append(userid, track, function(riff) {
            // anzeigen
            var svgSelector = addTrackToDOM(riff);
            displayRiffInSVG(svgSelector, riff);
            // current löschen
            audioTrack.clear();
            $('#recorder-svg').empty();
            $('#messagelist').animate({ scrollTop: 9999 }, 'slow');
        });
    }
}

function handlePlayMessage(ev) {
    ev.preventDefault();

    console.log("play");
}


function appendMessageList(riffs) {
    for (var i=0; i<riffs.length; i++) {
        var svgSelector = addTrackToDOM(riffs[i]);
        displayRiffInSVG(svgSelector, riffs[i]);
    }
    $('#messagelist').animate({ scrollTop: 9999 }, 'fast');
}

function reloadMessageList() {
    $('#messagelist').empty();

    messageList.loadAll(function(riffs){
        // success
        appendMessageList(riffs);
    },
    function() {
        // error
        showStatus("error loading riffs from server");
    });

}

function checkReloadMessageList() {
    if (audioTrack.recording) {
        // no refresh on recording
        return;
    }
    console.log("reload messagelist");
    messageList.loadNew(function(riffs){
        // success
        if (riffs.length > 0) {
            appendMessageList(riffs);
        }
    },
    function() {
        // error
        showStatus("error loading riffs from server");
    });
}

function initialize() {
    soundInstrument.push( new AudioSound(audioContext, {url:'sound/c.wav'}) );
    soundInstrument.push( new AudioSound(audioContext, {url:'sound/d.wav'}) );
    soundInstrument.push( new AudioSound(audioContext, {url:'sound/e.wav'}) );
    soundInstrument.push( new AudioSound(audioContext, {url:'sound/f.wav'}) );
    soundInstrument.push( new AudioSound(audioContext, {url:'sound/g.wav'}) );
    beepSoundA = new AudioBeep(audioContext, {frequency:2300});
    beepSoundB = new AudioBeep(audioContext, {frequency:2000});

    var selectors = ['#ckey', '#dkey', '#ekey', '#fkey', '#gkey'];
    for (var i=0; i<selectors.length; i++) {
        handleKeySound(selectors[i], soundInstrument[i], i, handleOn, handleOff);
    }

    $('#record').on("touchstart click", handleRecord);
    $('#play').on("touchstart click", handlePlay);

    $('#send').on("touchstart click", handleSend);
    $('#refresh').on("touchstart click", handleRefresh);

    $('.msg-svg').on("touchstart click", handlePlayMessage);

    reloadMessageList();

    // reload every 5 seconds
    setInterval(checkReloadMessageList, 5*1000);

}

// document is reay 
$( function() {	

    initialize();
});




