"use strict"

function AudioTrack(option) {
	if (!option) {
		option = {
			bpm: 120,					// 120 beats per minute
			maxNoteRatio: 16,	// min note is 1/16
			bars: 4,					// number of bars
			beatsPerBar: 4		// beats per bar
		}
	}
	this.running = false;
	this.notes = [];
	this.startTime = undefined;
	this.bpm = option.bpm || 120;
	this.maxNoteRatio = option.maxNoteRatio || 16;
	this.bars = option.bars || 4;
	this.beatsPerBar = option.beatsPerBar || 4;
	this.stopCallback = option.stopCallback;
	this.beatCallback = option.beatCallback;
	// in ms
	this.quant = 60000 / this.bpm / 16;

	this.tick = 60 * 1000 / this.bpm;
	this.length = this.tick * this.beatsPerBar * this.bars;
	this.recording = false;
};


AudioTrack.prototype.stop = function() {
	this.recording = false;
	clearInterval(this.intervalBeat);
	if (this.stopCallback) {
		this.stopCallback(this);
	}
}

AudioTrack.prototype.start = function() {
	this.startTime = (new Date().getTime());
	this.notes = [];
	this.recording = true;
	setTimeout( this.stop.bind(this), this.length );
	if (this.beatCallback) {
		this.beatCallback();
		this.intervalBeat = setInterval(this.beatCallback, this.tick);
	}
};

AudioTrack.prototype.getTrack = function() {
	return {length:this.length, notes:this.notes};
}

AudioTrack.prototype.on = function() {
	this.onTime = this.elapsed();
//	console.log("start:", this.start);
}

AudioTrack.prototype.elapsed = function() {
	var elapsed = new Date().getTime() - this.startTime;
	return this.quantysize(elapsed);
}

AudioTrack.prototype.quantysize = function(time) {
	var mod = time % this.quant;
	time -= mod;
	if (mod >= this.quant/2) {
		time += this.quant;
	}
	return Math.floor(time);
}

AudioTrack.prototype.off = function() {
	var elapsed = this.elapsed();
	this.notes.push( {start:this.onTime, width:elapsed - this.onTime})
}


exports.AudioTrack = AudioTrack;

