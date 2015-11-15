
var Riffer = (function() {

	this.getChats = function() {
		return [
			{ name: "Paula"},
			{ name: "Klarl"}
		];
	}

	return {
		getChats: getChats
	}
})()


$(document).ready(function() {
	Riffer.getChats().forEach( function(chat) {
		$("#chatlist").append("<div>" + chat.name + "</div>");
	})
});