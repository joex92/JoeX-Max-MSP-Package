autowatch = 1
inlets = 2
outlets = 1

var l,args = joex.GetArgs(jsarguments)[1];
joex.postln(args.length);
var scalefrom,scaleto,l2scale,lscaled;
if ((args.length == 2)||(args.length == 4)){
	scalefrom = [args[0],args[1]];
	scaleto = [-1,1];
	if (args.length == 4){
		scaleto = [args[2],args[3]];
	}
	post("\nScaling from ["+scalefrom+"] to ["+scaleto+"]")
}
else{
	if (((args.length != 2)||(args.length != 4)) && (args.length > 0)){
		post("\nWrong values\n");
	}
	clear();
}

function clear(){
	scalefrom = [-1,1];
	scaleto = [-1,1];
	l2scale = [];
	lscaled = [];
}

function bang(){
	outlet(0,lscaled);
}

function list(){
	l = joex.arrayNumDelace(arrayfromargs(messagename,arguments))[1];
	switch (inlet) {
	case 0:
		if (l.length > 0){
			l2scale = joex.copy(l);
			lscaled = new Array(l2scale.length);
			for (i = 0;i < l2scale.length;i++){
				lscaled[i]=joex.lscale(l2scale[i],scalefrom,scaleto);
			}
			bang();
		}else
		{
			post("\nInvalid List\n");
		}
		break;
	case 1:
		if ((args.length == 2)||(args.length == 4)){
			scalefrom = [l[0],l[1]];
			if (l.length == 4){
				scaleto = [l[3],l[4]];
			}
		}
		else {
			post("\nInvalid List\n");
		}
		break;
	}
}