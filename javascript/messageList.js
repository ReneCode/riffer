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
				// track zurückgeben.
				if (callback) {
					callback(result);
				}
      },
      error: function(xhr, status, err) {
      	console.log("Error:" + status + " - " + err);
      }
  });
};


MessageList.prototype.appendToList = function(riff) {
	if (riff instanceof Array) {
		var self = this;
		riff.forEach(function(r) {
			self.list.push(r);
		});
 	} else {
		this.list.push(riff);
	}
};

// load the last messages from the server
MessageList.prototype.loadAll = function(callback, errCallback, option) {
	var self = this;
  var url = Utility.getApiHost() + '/api/v1/riff';
	$.ajax( {
		url: url,
		type: 'GET',
		data: option,
		success: function(result) {
			self.appendToList(result);
			if (callback) {
				callback(result);
			}
		},
		error: function(xhr) {
			if (errCallback) {
				errCallback(xhr);
			}
    }
	});
};

MessageList.prototype.loadNew = function(callback, errCallback) {
	var lastDate;
	// get date from last element
	var len = this.list.length;
	if (len > 0) {
		lastDate = this.list[len-1].date;
	}
	console.log("loadNew:" + len + " / " + lastDate);
	if (lastDate) {
		this.loadAll(callback, errCallback, {newerthan: lastDate});
	}

};

exports.MessageList = MessageList;

