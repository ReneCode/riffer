
function AudioTrack(option) {
	"use strict";
	if (!option) {
		option = {
			bpm: 120,					// 120 beats per minute
			maxNoteRatio: 16,	// min note is 1/16
			bars: 4,					// number of bars
			beatsPerBar: 4,		// beats per bar
			numNotes: 10,
			quantysize: true
		};
	}
	this.running = false;
	this.notes = [];
	this.startTime = undefined;
	this.bpm = option.bpm || 120;
	this.maxNoteRatio = option.maxNoteRatio || 16;
	this.bars = option.bars || 4;
	this.beatsPerBar = option.beatsPerBar || 4;
	if (option.hasOwnProperty('quantysize')) {
		this.quantysize = option.quantysize;
	} else {
		this.quantysize = true;
	}
	this.stopCallback = option.stopCallback;
	this.beatCallback = option.beatCallback;
	// in ms
	this.quant = 60000 / this.bpm / 16;

	this.tick = 60 * 1000 / this.bpm;
	this.length = this.tick * this.beatsPerBar * this.bars;
	this.recording = false;
}


AudioTrack.prototype.stop = function() {
	"use strict";
	this.recording = false;
	clearInterval(this.intervalBeat);
	if (this.stopCallback) {
		this.stopCallback(this);
	}
};


AudioTrack.prototype.beat = function() {
	"use strict";
	if (this.beatCallback) {
		// first-beat will called with (true)
		var first = false;
		if (this.beatCounter % this.beatsPerBar === 0) {
			first = true;
		}
		this.beatCallback(first);
		this.beatCounter++;
	}
};

AudioTrack.prototype.start = function() {
	"use strict";
	this.startTime = (new Date().getTime());
	this.notes = [];
	this.onTime = {};
	this.recording = true;
	this.beatCounter = 0;
	setTimeout( this.stop.bind(this), this.length );
	if (this.beatCallback) {
		this.beat();
		this.intervalBeat = setInterval(this.beat.bind(this), this.tick);
	}
};

AudioTrack.prototype.getTrack = function() {
	"use strict";

	function cmp(a,b) {
		if (a.start < b.start) {
			return -1;
		} else if (a.start > b.start) {
			return 1;
		} else {
			if (a.note < b.note) {
				return -1;
			} else if (a.note > b.note) {
				return 1;
			} else {
				return 0;
			}
		}
	}

	return {length:this.length, notes:this.notes.sort(cmp)};
};

AudioTrack.prototype.elapsed = function() {
	var elapsed = new Date().getTime() - this.startTime;
	return this.quantysizeTime(elapsed);
};

AudioTrack.prototype.quantysizeTime = function(time) {
	"use strict";
	if (this.quantysize) {
		var mod = time % this.quant;
		time -= mod;
		if (mod >= this.quant/2) {
			time += this.quant;
		}
		return Math.floor(time);
	}
	else {
		return time;
	}
};

AudioTrack.prototype.onNote = function(note) {
	this.onTime[note] = this.elapsed();
};

AudioTrack.prototype.offNote = function(note) {
	var elapsed = this.elapsed();
	this.notes.push( {note:note, start:this.onTime[note], width:elapsed - this.onTime[note]});
};


exports.AudioTrack = AudioTrack;

