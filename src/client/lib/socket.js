var socket = io.connect('http://localhost:8080');

/**
 * General methods used
 */
function setState(state) {

	$("body").removeClass("connected uncertain disconnected");
	$("body").addClass(state);
};

var enabledFlots = {};

function createFlot(path, min, max) {

    $("#flots").append("<div id='" + path + "'></div>");
    return $.plot("#" + path, [], {
        series: {
            shadowSize: 0	// Drawing is faster without shadows
        },
        yaxis: {
            min: min || 0,
            max: max || 2000
        },
        xaxis: {
            show: false
        }
    });
}

function destroyFlot(path) {
    $("div#" + path).remove();
}

function setFlot(path, enabled, min, max) {

    if(enabled == null) enabled = true;

    if(enabled && (enabledFlots[path] == null || !enabledFlots[path])) {
        enabledFlots[path] = createFlot(path, min, max);
    }

    if(!enabled && enabledFlots[path]) {
        destroyFlot(path);
    }
}

function setFlotData(path, data) {

    if( enabledFlots[path] != null && enabledFlots[path] ) {

        enabledFlots[paths].setData([ data ]);
        enabledFlots[paths].draw();
    }
}

var table = {},
    jTable = null,
    columns = 8;

function setTableValue(path, value, min, max) {

    if(jTable == null) jTable = $("table#raw-table tbody");

    var count = 0;

    for (var title in values) {

        // Add the counter
        path = path + '_' + count;

        if(typeof table[path] == "undefined") {
            // Always used
            var the_column = '<td id=' + path + '><button class="btn btn-default btn-block" data-toggle="tooltip" data-placement="top" data-original-title="' + title + '">' + parseFloat(values[title]).toFixed(2); values[title] + '</button></td>';
            // We just have to catch whether to make a new row
            if(jTable.children("tr").length <= 0 || jTable.children("tr").last().children("td").length >= columns) {
                table[path] = jTable.append('<tr>' + the_column + '</tr>').children("tr").last().children("td").last();
            } else {
                table[path] = jTable.children("tr").last().append(the_column).children("td").last();
            }
            // Enable tooltips
			$(table[path]).children("button").tooltip();
			$(table[path]).children("button").off("click").on("click", function(){
                if($(this).hasClass('btn-default')) {
                    $(this).removeClass("btn-default").addClass("btn-success");
                    setFlot(path, true, min ,max);
                } else {
                    $(this).removeClass("btn-success").addClass("btn-default");
                    setFlot(path, false, min ,max);
                }
			});
        } else {
            table[path].children("button").text(parseFloat(values[title]).toFixed(2));
            setFlotData(path, parseFloat(values[title]).toFixed(2));
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
	$("#battery i").attr("data-percentage", data.config.battery_percent_remaining).parent().attr("data-percentage", data.config.battery_percent_remaining);
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
socket.on('/muse/batt', function(data){
	// Set percentage values
    $("#battery i").attr("data-percentage", Math.round(data.values[0] / 100)).parent().attr("data-percentage",  Math.round(data.values[0] / 100));

});

// Get EEG values
socket.on('/muse/eeg', function(data){

    setTableValue(data.path, {
        'EEG: Left Ear' : data.values[0],
        'EEG: Left Forehead' : data.values[1],
        'EEG: Right Forehead' : data.values[2],
        'EEG: Right Ear' : data.values[3]
    }, 0, 1683);

});

// Get ACC values
socket.on('/muse/acc', function(data){

    setTableValue(data.path, {
        'Accelerometer: Forward and backward position' : data.values[0],
        'Accelerometer: Up and down position' : data.values[1],
        'Accelerometer: Left and right position' : data.values[2],
    }, -512, 512);

});

// Now ask for all the data
socket.emit('setPaths',
    [
    	'/muse/acc',
        '/muse/eeg',
        '/muse/batt',
        '/muse/elements/horseshoe',
    ]
);