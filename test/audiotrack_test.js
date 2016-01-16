
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
	})
})


describe('AudioTrack', function() {
	var at;
	
	beforeEach(function() {
		at = new AudioTrack();
	});

	it ('can be created', function() {
		expect(at).toBeA('object');
	})

	it ('has a start function', function() {
		expect(at.start).toExist();
	})

	it ('has a getTrack function', function() {
		expect(at.getTrack).toExist();
	})

	it ('gets an empty array without input', function() {
		expect(at.getTrack()).toEqual([]);
	})

	it ('quantize on 1/16 not of 120 bpm', function() {
		expect(at.quantysize(3)).toEqual(0);
		expect(at.quantysize(31)).toEqual(31);
		expect(at.quantysize(31+15)).toEqual(31);
		expect(at.quantysize(31+16)).toEqual(62);
		expect(at.quantysize(3125)).toEqual(3125);
		expect(at.quantysize(3124)).toEqual(3125);
		expect(at.quantysize(3126)).toEqual(3125);
	})

	it ('records single 100 ms on()-event', function(done) {
		at.start();
		setTimeout( function() {
			at.on();
			setTimeout(function() {
				at.off();
				var result = at.getTrack();
				expect(result).toEqual([{start:62, width:94}]);
				done();
			}, 100)
		}, 50);
	})


	it ('records single 100 ms on()-event', function(done) {
		at.start();
		setTimeout( function() {
			at.on();
			setTimeout(function() {
				at.off();
				setTimeout(function() {
					at.on();
					setTimeout(function() {
						at.off();
						var result = at.getTrack();
						expect(result).toEqual([{start:62, width:94},
												{start:218, width:188}]);
						done();


					}, 180);
				}, 60);
			}, 90)
		}, 60);
	})


	it ('call the beatCallback n times (n depends on bpm)', function(done) {
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
	})

})


