
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

	view = "<svg>" + sView + "</svg>";
	return view;
};

exports.TrackView = TrackView;
