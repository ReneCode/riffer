
var TrackView = require('../javascript/trackView.js').TrackView;
var expect = require('expect');

describe('TrackView', function() {
	var tv;
	beforeEach(function() {
		tv = new TrackView({width:400, height:80});
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
		expect(svg).toEqual([]);
	})

	it('should convert one note track to rect svg', function() {
		var at = {length:2000,notes:[{start:200,width:50}]}
		var svg = tv.convert(at);
		expect(svg).toEqual([{x:40, y:0, width:10, height:80}]);
	})

	it('should convert two note track to rect svg', function() {
		var at = {length:2000,notes:[
				{start:100,width:50},
				{start:200,width:50} ] };
		var svg = tv.convert(at);
		expect(svg).toEqual([{x:20, y:0, width:10, height:80},
									{x:40, y:0, width:10, height:80}]);
	})


});