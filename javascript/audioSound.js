
function AudioSound(context, option) {
	this.context = context;
  if (!option) {
    option = {};
  }
	this.url = option.url;
	this.soundBuffer = undefined;
  this.soundSource = undefined;
  this.gainNode = undefined;

  if (this.url) {
    this.load(context, this.url);
  }
}

AudioSound.prototype.load = function(context, url) {
  // Note: this loads asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  // save this as closure for the onload() callback.
  var self = this;
  // Our asynchronous callback
  request.onload = function() {
  	context.decodeAudioData(request.response, function(b) {
  		self.soundBuffer = b;
  	});
  };

  request.send();
};

AudioSound.prototype.play = function(offset, duration) {
	// play the source now
	if (!offset) {
	    offset = 0;
	}
	if (!duration) {
	    duration = 10;
	}
	this.soundSource = this.context.createBufferSource();
	this.soundSource.buffer = this.soundBuffer;
	var gainNode = this.context.createGain();
	this.soundSource.connect(gainNode);
	gainNode.connect(this.context.destination);
	this.soundSource.start(this.context.currentTime+offset, 0, duration); // , 0.4, 1);
};

AudioSound.prototype.stop = function() {
  var tim = this.context.currentTime;
  this.soundSource.stop(this.context.currentTime);
};

exports.AudioSound = AudioSound;

