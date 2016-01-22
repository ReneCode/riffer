"use strict"

function TrackView(option) {
	if (!option) {
		option = {
			width: 200,
			height: 50
		}
	}
	this.width = option.width || 200;
	this.height = option.height || 50;

}



TrackView.prototype.convert = function(track) {
	var sView = "";


	// <rect x="50" y="0" width="20" height="100" fill="brown" />


	if (track && track.notes) {
		var height = this.height;
		var xScale = this.width / track.length;
		track.notes.forEach(function(n) {
			var x = Math.floor(n.start * xScale);
			var w = Math.floor(n.width * xScale);
			sView += '<rect x="' + x + '" y="0" width="' + w + '" height="' + height + '" fill="blue"/>' 
		});
	}

	return sView;
};

exports.TrackView = TrackView;
