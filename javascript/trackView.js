
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
	if (!track ||  !track.notes) {
		return [];
	}

	function inside(a, minA, maxA) {
		return a > minA && a < maxA;
	}

	var blocks = [];
	var xScale = this.width / track.length;

	function fillBlocks()
	{	
		var block;
		var min, max;
		for (var i=0; i<track.notes.length; i++) {
			var n = track.notes[i];

			if (!block) {
				block = [n];
				min = n.start;
				max = n.start + n.width;
			}
			else {
				if (inside(n.start, min, max)) {
					block.push(n);
					max = Math.max(max, n.start+n.width);
				}
				else {
					// start new block
					blocks.push(block);
					block = [n];
					min = n.start;
					max = n.start + n.width;
				}
			}
		}
		blocks.push(block);
	}

	fillBlocks();


	for (var iBlock=0; iBlock<blocks.length; iBlock++) {
		var block = blocks[iBlock];
		var blockLen = block.length;
		var noteHeight = Math.floor(this.height / blockLen);
		for (var iNote=0; iNote<blockLen; iNote++) {
			var n = block[iNote];
			var x = Math.floor(n.start * xScale);
			var w = Math.floor(n.width * xScale);
			var rect = {	x:x,
										y:(blockLen-iNote-1)*noteHeight,
										width:w,
										height:noteHeight };
			if (n.note !== undefined) {
				rect.fill = this.colors[n.note];
			 }
			view.push(rect);
		}
	}


	return view;
};

exports.TrackView = TrackView;
