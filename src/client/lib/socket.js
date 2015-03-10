var socket = io.connect('http://localhost:8080');

function setState(state) {

	$("body").removeClass("connected uncertain disconnected");
	$("body").addClass(state);
};

socket.on('muse_connected', function(data){
	setState("connected");
});

socket.on('muse_uncertain', function(){
	setState("uncertain");
});

socket.on('muse_disconnected', function(){
	setState("disconnected");
})

socket.on('disconnect', function(){
	setState("disconnected");
});

socket.on('connected', function (data) {
	if( data.connected ) setState("connected");
});

// Set the readability values
socket.on('/muse/elements/horseshoe', function(data){

	var excellence_counter = 0;
	for(var i in data.values) {
		$("#readability-bar-" + i).css("width", ( 100 / data.values[i] - (( 100 / data.values[i] <= 25 ) ? 25 : 0) ) + "%");
		if(data.values[i] <= 1) {
			excellence_counter++;
		}
	}
	if(excellence_counter > 3) {
		$("#readability").addClass("excellent");
	} else {
		$("#readability").removeClass("excellent");
	}

});

socket.emit('setPaths', ['/muse/elements/horseshoe']);