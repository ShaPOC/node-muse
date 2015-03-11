var socket = io.connect('http://localhost:8080');

/**
 * General methods used
 */
function setState(state) {

	$("body").removeClass("connected uncertain disconnected");
	$("body").addClass(state);
};

var table = {},
    jTable = null,
    columns = 6;

function setTableValue(path, values) {

    if(jTable == null) jTable = $("table#raw-table tbody");

    var count = 0;

    for (var title in values) {

        if(!table[path + '_' + count]) {
            // Always used
            var the_column = '<td id=' + path + '_' + count + ' data-toggle="tooltip" data-placement="top" data-original-title="' + title + '">' + values[title] + '</td>';
            // We just have to catch whether to make a new row
            if(jTable.children("tr").length <= 0 || jTable.children("tr").last().children("td").length >= columns) {
                table[path + '_' + count] = jTable.append('<tr>' + the_row + '</tr>');
            } else {
                table[path + '_' + count] = jTable.children("tr").last().append(the_column);
            }
        } else {
            table[path + '_' + count].text(values[title]);
        }

        count ++;
    }
}

/**
 * Connection states received by the socket
 */
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

/**
 * Specific data received by the socket
 */

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

// Get the battery value
socket.on('/muse/bat', function(data){

    $("#battery i").attr("data-percentage", Math.round(data.values[0] / 100));

});

// Get EEG values
socket.on('/muse/eeg', function(data){

    setTableValue(data.path, {
        'Left Ear' : data.values[0],
        'Left Forehead' : data.values[1],
        'Right Forehead' : data.values[2],
        'Right Ear' : data.values[3]
    });

});

// Now ask for all the data
socket.emit('setPaths',
    [
        '/muse/batt',
        '/muse/elements/horseshoe',
        '/muse/eeg'
    ]
);

// Enable tooltips
$('[data-toggle="tooltip"]').tooltip();