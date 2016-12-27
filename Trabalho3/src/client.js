function get_request(requestString, onSuccess, onError, port){
	var requestPort = port || 8081;
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = function(){ request_response =  request.response;console.log('Request successful! ' + request_response); waiting_response = false;};
	
	request.onerror = onError || function(){
		console.log("Error waiting for response");waiting_response = false;
	};
	
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
}

var request_response = null;
var waiting_response = false;