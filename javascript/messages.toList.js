autowatch = 1;
outlets = 1;
var args = joex.GetArgs(jsarguments)[1];
joex.postln("jsargs:"+jsarguments.length);
joex.postln("args:"+args.length);
if (args.length > 0){
    inlets = args[0];
	if (args.length > 1){
		post("Only 1 numerical argument needed, taking first one.\n");
	}
}
else {
	inlets = 2;
}
var args;
var l = new Array(inlets);

function anything() {
	for (i = 0 ; i < inlets ; i++){
		if (inlet == i){
			args = arrayfromargs(messagename, arguments).join(" ");
			if (args == "clear"){
				l = [];
			}
			else {
				l[i] = String(args);
			}
		}
	}
	 bang();
}

 function bang() {
 	outlet(0,l.filter(Boolean).join(" "));
 }