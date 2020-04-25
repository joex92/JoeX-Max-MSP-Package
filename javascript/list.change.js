autowatch = 1
inlets = 1
outlets = 1

var args = joex.GetArgs(jsarguments)[1];
var tv=0.0,tl=[],fl=[],first=true;

if (args.length == 1){
    tv = parseFloat(args[0]);
}
else {
	anything();
}

function list(){
	var l = arrayfromargs(messagename, arguments);
	for (i = 0;i < l.length;i++){
		if (Number(l[i]) != "NaN"){
			l[i] = parseFloat(l[i]);
		}
		if (first){
			tl[i] = parseFloat(tv);
		}
	}
	fl = l;
	if (fl.length == 0){
		first = true;
	}
	else {
		first = false;
	}
	if (first){
		bang();
		tl = joex.copy(fl);
	}
	else {
		if (tl.length == fl.length){
			var same = true;
			for (i = 0;i < fl.length;i++){
				same = same && (tl[i] == fl[i]);
			}
			if (!same){
				bang();
				tl = joex.copy(fl);
			}
		}
		else {
			bang();
			tl = joex.copy(fl);
		}
	}
}

function bang(){
	outlet(0,fl);
}

function clear(){
	tv=0.0;
	tl=[];
	fl=[];
}

function anything(){
	post("Invalid message and/or value");
}