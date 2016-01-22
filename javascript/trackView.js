
function TrackView(option) {
	"use strict";

	if (!option) {
		option = {
			width: 200,
			height: 50
		};
	}
	this.width = option.width || 200;
	this.height = option.height || 50;

}



TrackView.prototype.convert = function(track) {
	"use strict";

	var view = [];

	if (track && track.notes) {
		var height = this.height;
		var xScale = this.width / track.length;
		track.notes.forEach(function(n) {
			var x = Math.floor(n.start * xScale);
			var w = Math.floor(n.width * xScale);
			view.push(
			{	x:x,
				y:0,
				width:w,
				height:height }
				);

		});
	}
	return view;
};

exports.TrackView = TrackView;
