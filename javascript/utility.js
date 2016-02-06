

function _getApiHost() {
	var apiHost = "http://localhost:64020";
	return apiHost;
}

function getApiHost() {
	var apiHost = "http://localhost:64020";
	var host = location.host;
	if (!host.match('localhost.*')) {
	  // change route to subdomain "<protocol>://api.<host>"
	  // =>   different service / look at .htaccess !
	  // remove the subdomain
	  host = host.match(/[^\.]*\.[^.]*$/)[0];
	  apiHost = location.protocol + "://rifferapi." + host;
/*	  var port = location.port;
	  if (port) {
	    apiHost += ":" + port;
	  } */
	}
	return apiHost;
	}


exports.getApiHost = getApiHost;
