autowatch = 1
inlets = 1
outlets = 2

var args = joex.GetArgs(jsarguments)[1];
if (args.length > 0){
	outlets = args[0];
	if (args.length > 1){
		post("Only 1 numerical argument needed, taking first one.");
	}
}
var inl = new Array(outlets);

function bang(){
	for(i = outlets-1;i > -1;i--){
		outlet(i,delacelist(inl,outlets)[i]);
	}
}

function delacelist (l,m) {
	var dl = new Array(m);
	for (i = 0;i < m;i++){
		dl[i]=[];
	}
	for (i = 0;i < l.length;i++){
		dl[i%m].push(l[i]);
	}
	return dl;
}

function list(){
	inl = arrayfromargs(messagename,arguments);
	bang();
}