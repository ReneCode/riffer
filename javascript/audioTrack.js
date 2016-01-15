"use strict"

function AudioTrack(option) {
	if (!option) {
		option = {
			bpm: 120,					// 120 beats per minute
			maxNoteRatio: 16,	// min note is 1/16
			maxLength: 4			// length in seconds
		}
	}
	this.running = false;
	this.result = [];
	this.startTime = undefined;
	this.bpm = option.bpm || 120;
	this.maxNoteRatio = option.maxNoteRatio || 16;
	this.maxLength = option.maxLength || 4;
	this.stopCallback = option.stopCallback;
	this.beatCallback = option.beatCallback;
	// in ms
	this.quant = 60000 / this.bpm / 16;
};


AudioTrack.prototype.stop = function() {
	clearInterval(this.intervalBeat);
	if (this.stopCallback) {
		this.stopCallback(this);
	}
}

AudioTrack.prototype.start = function() {
	this.startTime = (new Date().getTime());
	this.result = [];
	setTimeout( this.stop, this.maxLength * 1000);
	if (this.beatCallback) {
		var tick = 60 * 1000 / this.bpm;
		this.intervalBeat = setInterval(this.beatCallback, 60 * 1000 / this.bpm);
	}
};

AudioTrack.prototype.getTrack = function() {
	return this.result;
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
	this.result.push( {start:this.onTime, width:elapsed - this.onTime})
}


exports.AudioTrack = AudioTrack;

