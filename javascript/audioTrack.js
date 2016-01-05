"use strict"

function AudioTrack() {
	this.running = false;
	this.result = [];
	this.startTime = undefined;
	this.bpm = 120;
	this.maxNoteRatio = 16;
	// in ms
	this.quant = 60000 / this.bpm / 16;
};



AudioTrack.prototype.start = function() {
	this.startTime = (new Date().getTime());
};

AudioTrack.prototype.getTrack = function() {
	return this.result;
}

AudioTrack.prototype.on = function() {
	this.start = this.elapsed();
	console.log("start:", this.start);

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
	this.result.push( {start:this.start, width:elapsed - this.start})
}


module.exports = AudioTrack;

