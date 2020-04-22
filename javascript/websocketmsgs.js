inlets = 1;
outlets = 1;
var inls = joex.GetArgs(jsargumens)[1];
if (inls.length == 1){
    inlets = inls[0];
}
var args;
var l = new Array();

// function bang() {
// 	outlet(0,l.filter(Boolean).join(" "));
// }

function anything() {
	for (i = 0 ; i < inlets ; i++){
		if (inlet == i){
			args = arrayfromargs(arguments);
			if (args == "reset"){
				l = [];
			}
			else {
				l[i] = String(args);
			}
		}
	}
	// bang();
	outlet(0,l.filter(Boolean).join(" "));
}

// function reset() {
// 	l = [];
// }