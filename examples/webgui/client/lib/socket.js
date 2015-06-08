/**
 *  Node Muse
 *  Web Gui example
 *
 *  This is the frontend socket script connecting to the
 *  backend server and subscribing to its information.
 *  ---------------------------------------------------
 *  @package    node-muse
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    1.0.0
 *  @since      File available since Release 0.1.0
 */


/**
 * Quick settings
 */

// Minimum update interval for the charts
var update_interval = 200;

/**
 * Required modules
 */

var socket = io.connect('http://localhost:8080');

/**
 * General methods used
 */
function setState(state) {

	$("body").removeClass("connected uncertain disconnected");
	$("body").addClass(state);
};

var enabledCharts = {};

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

function requestChartData(elem) {

    var container = $(elem.target.container);

    // If the chart was deleted before the timeout, then stop everything
    if(elem == null || container.length <= 0) {
        return false;
    }

    var path = container.parent().attr("id").replace("_chart", "")

    if(enabledCharts[path] != null) {
        var series = elem.target.series[0],
            shift = series.data.length > 20; // shift if the series is longer than 20

        // add the point
        elem.target.series[0].addPoint([(new Date()).getTime() , parseFloat(enabledCharts[path]["data"])], true, shift);
    }

     // call it again after interval
    setTimeout(function(){ requestChartData(elem) }, update_interval); 
}

function createChart(path, title, data) {

    enabledCharts[path] = {
    	"element" : $("#charts")
        .append("<div class='col-md-6'><div class='chart' id='" + path + "_chart'></div></div>")
        .children("div").last().children("div"),
        "data" : data,
        "title" : title
    }

    enabledCharts[path]["chart"] = new Highcharts.Chart({
        chart: {
            renderTo: path + "_chart",
            defaultSeriesType: 'spline',
            marginRight: 10,
            events: {
                load: requestChartData
            }
        },
        title: {
            text: title
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: '#8cc152'
            }]
        },
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: title,
            data: [{ x: (new Date()).getTime(), y: parseFloat(data)}],
            marker: {
		       enabled: false
		    }
        }]
    });      
}

function destroyChart(path) {
    enabledCharts[path].chart.destroy();
    enabledCharts[path].element.parent().remove();
    delete enabledCharts[path];
}

function setChart(path, enabled, title, data) {

    if(enabled == null) enabled = true;

    if(enabled && (enabledCharts[path] == null || !enabledCharts[path])) {
        createChart(path, title, data);
    }

    if(!enabled && enabledCharts[path]) {
        destroyChart(path);
    }
}

function setChartData(path, data) {

    if( enabledCharts[path] != null && enabledCharts[path] ) {
        enabledCharts[path]["data"] = data;
    }
}

var table = {},
    jTable = null,
    columns = 7;

function setTableValue(opath, values) {

    if(jTable == null) jTable = $("table#raw-table tbody");

    var count = 0;

    for (var title in values) {

        // Add the counter
        path = opath + '_' + count;

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
                    setChart(path, true, title, parseFloat(values[title]).toFixed(2));
                } else {
                    $(this).removeClass("btn-success").addClass("btn-default");
                    setChart(path, false);
                }
			});
        } else {
            table[path].children("button").text(parseFloat(values[title]).toFixed(2));
            setChartData(path, parseFloat(values[title]).toFixed(2));
        }

        count ++;
    }
}

/**
 * Connection states received by the socket
 */
socket.on('muse_connected', function(data){
	setState("connected");
	if(data.config != null) 
        $("#battery i").attr("data-percentage", data.config.battery_percent_remaining).parent().attr("data-percentage", data.config.battery_percent_remaining);
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
	if( data.connected ) {
		setState("connected");
        if(data.config != null) 
            $("#battery i").attr("data-percentage", data.config.battery_percent_remaining).parent().attr("data-percentage", data.config.battery_percent_remaining);
	}
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
    });

});

// Get ACC values
socket.on('/muse/acc', function(data){

    setTableValue(data.path, {
        'Accelerometer: Forward and backward position' : data.values[0],
        'Accelerometer: Up and down position' : data.values[1],
        'Accelerometer: Left and right position' : data.values[2],
    });

});

socket.on('/muse/elements/blink', function(data){

    setTableValue(data.path, {
        'Eye blink' : data.values
    });

});

socket.on('/muse/elements/jaw_clench', function(data){

    setTableValue(data.path, {
        'Jaw Clench' : data.values
    });

});

socket.on('/muse/elements/low_freqs_absolute', function(data){

    setTableValue(data.path, {
        'Absolute Band Powers: Low Frequency' : data.values
    });

});

socket.on('/muse/elements/delta_absolute', function(data){

    setTableValue(data.path, {
        'Absolute Band Powers: Delta' : data.values
    });

});

socket.on('/muse/elements/theta_absolute', function(data){

    setTableValue(data.path, {
        'Absolute Band Powers: Theta' : data.values
    });

});

socket.on('/muse/elements/alpha_absolute', function(data){

    setTableValue(data.path, {
        'Absolute Band Powers: Alpha' : data.values
    });

});

socket.on('/muse/elements/beta_absolute', function(data){

    setTableValue(data.path, {
        'Absolute Band Powers: Beta' : data.values
    });

});

socket.on('/muse/elements/gamma_absolute', function(data){

    setTableValue(data.path, {
        'Absolute Band Powers: Gamma' : data.values
    });

});

socket.on('/muse/elements/delta_relative', function(data){

    setTableValue(data.path, {
        'Relative Band Powers: Delta' : data.values
    });

});

socket.on('/muse/elements/theta_relative', function(data){

    setTableValue(data.path, {
        'Relative Band Powers: Theta' : data.values
    });

});

socket.on('/muse/elements/alpha_relative', function(data){

    setTableValue(data.path, {
        'Relative Band Powers: Alpha' : data.values
    });

});

socket.on('/muse/elements/beta_relative', function(data){

    setTableValue(data.path, {
        'Relative Band Powers: Beta' : data.values
    });

});

socket.on('/muse/elements/gamma_relative', function(data){

    setTableValue(data.path, {
        'Relative Band Powers: Gamma' : data.values
    });

});

socket.on('/muse/elements/delta_session_score', function(data){

    setTableValue(data.path, {
        'Band Power Session Score: Delta' : data.values
    });

});

socket.on('/muse/elements/theta_session_score', function(data){

    setTableValue(data.path, {
        'Band Power Session Score: Theta' : data.values
    });

});

socket.on('/muse/elements/alpha_session_score', function(data){

    setTableValue(data.path, {
        'Band Power Session Score: Alpha' : data.values
    });

});

socket.on('/muse/elements/beta_session_score', function(data){

    setTableValue(data.path, {
        'Band Power Session Score: Beta' : data.values
    });

});

socket.on('/muse/elements/gamma_session_score', function(data){

    setTableValue(data.path, {
        'Band Power Session Score: Gamma' : data.values
    });

});

// Now ask for all the data
socket.emit('setPaths',
    [
    	'/muse/acc',
        '/muse/eeg',
        '/muse/batt',
        '/muse/elements/horseshoe',
        '/muse/elements/blink',
        '/muse/elements/jaw_clench',
        '/muse/elements/low_freqs_absolute',
        '/muse/elements/delta_absolute',
        '/muse/elements/theta_absolute',
        '/muse/elements/alpha_absolute',
        '/muse/elements/beta_absolute',
        '/muse/elements/gamma_absolute',
        '/muse/elements/delta_relative',
        '/muse/elements/theta_relative',
        '/muse/elements/alpha_relative',
        '/muse/elements/beta_relative',
        '/muse/elements/gamma_relative',
        '/muse/elements/delta_session_score',
        '/muse/elements/theta_session_score',
        '/muse/elements/alpha_session_score',
        '/muse/elements/beta_session_score',
        '/muse/elements/gamma_session_score'
    ]
);