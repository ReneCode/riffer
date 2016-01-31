
var MessageList = function() {
	this.list = [];
};

MessageList.prototype.append = function(track) {
	this.list.push(track);
	return this.list.length-1;
};



exports.MessageList = MessageList;
