
var AudioSound = require('../javascript/AudioSound').AudioSound;
var AudioTrack = require('../javascript/AudioTrack.js').AudioTrack;
var sinon = require('sinon');

//var AudioContext = require('../javascript/AudioContext');
var assert = require('assert');
var expect = require('expect');

describe('AudioSound', function() {

	// there has to be some fake XMLHttpRequest object

	var xhr, requests;

	before(function () {
	    xhr = sinon.useFakeXMLHttpRequest();
	    global.XMLHttpRequest = xhr;
	    requests = [];
	    xhr.onCreate = function (req) { requests.push(req); };
	});

	after(function () {
	    // Like before we must clean up when tampering with globals.
	    xhr.restore();
	});


	it ('can be created', function() {
		var as = new AudioSound();		
		assert.equal(typeof(as), 'object');
	});
});


describe('AudioTrack', function() {
	var at;
	
	beforeEach(function() {
		at = new AudioTrack();
	});

	it ('can be created', function() {
		expect(at).toBeA('object');
	});

	it ('has a start function', function() {
		expect(at.start).toExist();
	});

	it ('has a getTrack function', function() {
		expect(at.getTrack).toExist();
	});

	it ('gets an empty array without input', function() {
		expect(at.getTrack().notes).toEqual([]);
	});

	it ('should calc the default length', function() {
		expect(at.length).toBe(8000);
	});

	it ('should calc the length', function() {
		at = new AudioTrack({beatsPerBar:6, bars:2, bpm:180});
		// 4000 ms =  60/180 * 6 * 2 * 1000
		expect(at.length).toBe(4000);
	});

	it ('should return length in getTrack()', function() {
		var len = at.length;
		expect(at.getTrack().length).toBe(len);
	});

	it ('quantizeTime on 1/16 not of 120 bpm', function() {
		expect(at.quantysizeTime(3)).toEqual(0);
		expect(at.quantysizeTime(31)).toEqual(31);
		expect(at.quantysizeTime(31+15)).toEqual(31);
		expect(at.quantysizeTime(31+16)).toEqual(62);
		expect(at.quantysizeTime(3125)).toEqual(3125);
		expect(at.quantysizeTime(3124)).toEqual(3125);
		expect(at.quantysizeTime(3126)).toEqual(3125);
	});


	it ('should not quantize if option is false', function() {
		at = new AudioTrack({quantysize:false});
		expect(at.quantysizeTime(3)).toEqual(3);
		expect(at.quantysizeTime(31)).toEqual(31);
		expect(at.quantysizeTime(31+15)).toEqual(31+15);
		expect(at.quantysizeTime(31+16)).toEqual(31+16);
	});

	it ('records single 100 ms on()-event', function(done) {
		at.start();
		setTimeout( function() {
			at.onNote(1);
			setTimeout(function() {
				at.offNote(1);
				var notes = at.getTrack().notes;
				expect(notes).toEqual([{note:1, start:62, width:94}]);
				done();
			}, 100);
		}, 50);
	});

	it ('should records two same notes on/off', function(done) {
		at.start();
		setTimeout( function() {
			at.onNote(1);
			setTimeout(function() {
				at.offNote(1);
				setTimeout(function() {
					at.onNote(1);
					setTimeout(function() {
						at.offNote(1);
						at.stop();
						expect(at.getTrack()).toEqual(
									{ length:8000, 
										 notes:[{note:1, start:62, width:94},
													  {note:1, start:218, width:188}
													  ]
										});
						done();
					}, 180);
				}, 60);
			}, 90);
		}, 60);
	});

	it ('should records two different notes on/off', function(done) {
		at.start();
		setTimeout( function() {
			at.onNote(1);  		// t=  60 ms -> 62
			setTimeout(function() {
				at.onNote(2);   // t = 150 ms -> 156
				setTimeout(function() {
					at.offNote(2);  // t = 210 ms 
					setTimeout(function() {
						at.offNote(1);  // t = 380 ms
						at.stop();
						expect(at.getTrack()).toEqual(
									{ length:8000, 
										 notes:[  {note:1, start:62, width:344},
										 					{note:2, start:156, width:62}
													  ]
										});
						done();
					}, 180);
				}, 60);
			}, 90);
		}, 60);
	});
 

	it ('should records three different notes on/off', function(done) {
		at.start();
		setTimeout( function() {
			at.onNote(1);  		// t=  60 ms -> 62
			at.onNote(2);  		// t=  60 ms -> 62
			at.onNote(3);  		// t=  60 ms -> 62
			setTimeout(function() {
				at.offNote(2);   // t = 150 ms -> 156
				at.onNote(4);
				setTimeout(function() {
					at.offNote(1);  // t = 210 ms 
					at.offNote(3);  // t = 210 ms 
					setTimeout(function() {
						at.offNote(4);  // t = 380 ms
						at.stop();
						expect(at.getTrack()).toEqual(
									{ length:8000, 
										 notes:[  {note:1, start:62, width:156},
										 					{note:2, start:62, width:94},
										 					{note:3, start:62, width:156},
										 					{note:4, start:156, width:250}
													  ]
										});
						done();
					}, 180);
				}, 60);
			}, 90);
		}, 60);
	});
 



	it ('should call the beatCallback n times (n depends on bpm)', function(done) {
		var cbCount = 0;
		var cb = function() {
			cbCount++;
		};
		var numBeats = 8;
		var bpm = 160;
		var beatLen = 60/bpm;

		// expand the mocha-default-test timeout
		this.timeout(1000*beatLen * (numBeats+1) );

		at = new AudioTrack({beatCallback:cb, bpm:bpm});
		at.start();
		setTimeout( function() {
			at.stop();
			expect(cbCount).toEqual(numBeats);
			done();
		}, 1000*beatLen*numBeats - 50);		// sub 50 ms so we do not stop an a beat-boundary
	});

	it ('should stop beat after 3 bars', function(done) {
		var cbCount = 0;
		var cbBeat = function() {
			cbCount++;
		};
		var bars = 3;
		var bpm = 160;
		var beatLen = 60/bpm;
		var beatsPerBar = 3;

		// expand the mocha-default-test timeout
		var timeout = 1000 * beatLen *  bars * beatsPerBar;
		this.timeout(timeout + 2000);

		at = new AudioTrack({beatCallback:cbBeat, bpm:bpm, bars:bars, beatsPerBar:beatsPerBar});
		at.start();
		setTimeout( function() {
			expect(cbCount).toEqual(beatsPerBar * bars);
			done();
		}, timeout +1000 );

	});

	it ('should stop automaticly', function(done) {
		var stopCalled = false;
		var cbStop = function(track) {
			stopCalled = true;
			expect(stopCalled).toEqual(true);
			// track is the audioTrack that has stopped
			expect(track.bpm).toEqual(bpm);
			done();
		};

		var bpm=160,
				beatsPerBar=4,
				bars=2;
		var timeout = 1000*60/bpm*beatsPerBar*(bars+1);
		this.timeout(timeout);
		at = new AudioTrack({stopCallback:cbStop, bpm:bpm, beatsPerBar:beatsPerBar, bars:bars});
		at.start();
	});

});


