
var TrackView = require('../javascript/trackView.js').TrackView;
var expect = require('expect');

describe('TrackView', function() {
	var tv;
	beforeEach(function() {
		tv = new TrackView();
	})

	it('should be able to create', function() {
		expect(tv).toBeA('object');
	})

	it('should read the options', function() {
		var tv = new TrackView({width:300, height:80});
		expect(tv.width).toBe(300);
		expect(tv.height).toBe(80);
	})

	it('should convert empty track to empty svg', function() {
		var svg = tv.convert();
		expect(svg).toBe('<svg></svg>');
	})

	it('should convert simple track to rect svg', function() {
		var at = {len:2000,notes:[{s:100,w:50}]}
		var svg = tv.convert();
		expect(svg).toBe('<svg></svg>');
	})


});