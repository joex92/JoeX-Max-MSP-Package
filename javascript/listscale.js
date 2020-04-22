autowatch = 1
inlets = 2
outlets = 1

var l,args = joex.GetArgs(jsarguments)[1];
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
	l = joex.ArrToi0obji1Num(arrayfromargs(messagename,arguments))[1];
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

/*this are the functions used here
function lscale(value, from, to) {
	var fromsize = parseFloat( from[1] - from[0] );
	var tosize = parseFloat( to[1] - to[0] );
	var op;
	if (Math.abs(fromsize) != Math.abs(tosize)){
		if (fromsize < 0){
			op = ((value/fromsize) * tosize) - to[0];
		}
		else if (tosize < 0){
			op = to[0] - ((value/fromsize) * tosize);
		}
		else {
			op = ((value/fromsize) * tosize) + to[0];
		}
	}
	else {
		if (fromsize == -tosize){
			op = -value;
		}
		else {
			op = value;
		}
	}
	return parseFloat(op);
}

function GetArgs(jsargs,i){
    var args = [[],[]];
	if (jsargs.length > 1){
		var i,j=0,k=0;
		for (i = 1;i < jsargs.length;i++){
			if (isNumber(jsargs[i])){
		    	args[1][j]= parseFloat(jsargs[i]);
		    	j++;
			}
			else {
		    	args[0][k]= jsargs[i];
		    	k++;
			}
	    } 
		post("objs:"+k+" nums:"+j)
	}
	return args;
}

function isNumber(v){
	return (Number(v) < 0) || (Number(v) == 0) || (Number(v) > 0);
}

function ArrToi0obji1Num(arr){
    var marr = [[],[]];
	if (Array.isArray(arr)){
		if (arr.length > 1){
			var i,j=0,k=0;
			for (i = 0;i < arr.length;i++){
				post(Number(arr[i]));
				if (Number(arr[i]) != "nan"){
			    	marr[1][j]= parseFloat(arr[i]);
			    	j++;
				}
				else {
			    	marr[0][k]= arr[i];
			    	k++;
				}
		    } 
			post("objs:"+k+" nums:"+j)
		}
	}
	return marr;
}
*/