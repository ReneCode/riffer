
function TrackView(option) {
	"use strict";

	var defaultColors = [	'#24106b', 
								'#9bf0be',
								'#45b8ac',
								'#eb1062',
								'#ca009d'];

	if (!option) {
		option = {
			width: 200,
			height: 50,
			colors: defaultColors
		};
	}
	this.width = option.width || 200;
	this.height = option.height || 50;
	this.colors = option.colors || defaultColors;
}



TrackView.prototype.convert = function(track) {
	"use strict";

	var view = [];

	if (track && track.notes) {
		var height = this.height;
		var xScale = this.width / track.length;
		for (var i=0; i<track.notes.length; i++) {
			var n = track.notes[i];
			var x = Math.floor(n.start * xScale);
			var w = Math.floor(n.width * xScale);
			var rect = {	x:x,
										y:0,
										width:w,
										height:height };
			if (n.note) {
				//rect.fill = this.colors[n.note];
			}
			view.push(rect);
		}
	}
	return view;
};

exports.TrackView = TrackView;
