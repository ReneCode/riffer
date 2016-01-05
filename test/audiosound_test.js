
var AudioSound = require('../javascript/AudioSound');
var AudioTrack = require('../javascript/AudioTrack.js');

//var AudioContext = require('../javascript/AudioContext');
var assert = require('assert');
var expect = require('expect');

describe('AudioSound', function() {

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


})


