


function AudioBeep(audioContext, option) {
	"use strict";
	if (!option) {
		option = {
			type: "square",
			frequency: 2000,
			duration: 0.02
		};
	}
	this.audioContext = audioContext;
	this.duration = option.duration || 0.02;
	this.osc = audioContext.createOscillator();
	this.osc.type = option.type || 'square';
	this.osc.frequency.value = option.frequency || 2000;

	this.gainNode = audioContext.createGain();
	this.gainNode.gain.value = 0;

	this.osc.connect(this.gainNode);
	this.gainNode.connect(audioContext.destination);

	this.osc.start(audioContext.currentTime);
}

AudioBeep.prototype.play = function(duration) {
	"use strict";

	if (!duration) {
		duration = this.duration;
	}
  this.gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime);
  this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
};

exports.AudioBeep = AudioBeep;