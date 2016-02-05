var Utility = require('./utility');

var MessageList = function() {
	this.list = [];
};

MessageList.prototype.append = function(user, track, callback) {
  var url = Utility.getApiHost() + '/api/v1/riff';

  var riff = { userid: user,
               date: new Date(),
               data: track };
  var self = this;
  $.ajax( {
      url: url,
      type: 'POST',
      data: JSON.stringify(riff),
      dataType: 'JSON',
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        console.dir("gespeichert");
				self.list.push(result);
//				return this.list.length-1;
				// track zurückgeben.
				if (callback) {
					callback(result);
				}
      }
  });




};


MessageList.prototype.method_name = function(first_argument) {
	// body...
};

exports.MessageList = MessageList;



