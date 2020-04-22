autowatch = 1
inlets = 2
outlets = 1

var l,scaleto=[[],[],[]],to = [];
to = joex.GetArgs(jsarguments)[1];
var tolength = to.length;
if ((to.length < 2) || (to.length > 6)){
	
	post("\nWrong values\nScaling to default: X[-1,1] Y[-1,1] Z[-1,1]");
	to = [-1,1,-1,1,-1,1];
}
else {
	if (to.length%2 != 0){
		post("\nWrong values\nScaling to default: X[-1,1] Y[-1,1] Z[-1,1]");
		to = [-1,1,-1,1,-1,1];
	}
}
var i,j;
for (i = 0;i < to.length;i++){
	if (i%2==0){
		j = i/2;
		scaleto[j][0]=parseFloat(to[i]);
	}
	else {
		j = (i-1)/2;
		scaleto[j][1]=parseFloat(to[i]);
	}
}
var coord,scaled,scalefrom;
clear();


function bang(){
	outlet(0,scaled);
}

function clear(){
	scalefrom = [[-1,1],[-1,1],[-1,1]];
	coord = [];
	scaled = [];
}

function list(){
	l = joex.ArrToi0obji1Num(arrayfromargs(arguments))[1];
	switch (inlet) {
	case 0:
		if ((l.length > 1) && (l.length%2 == 0) && (l.length < 7)){
			coord = joex.copy(l);
//			post("\n");
//			post(scalefrom.join(" "));
//			post("\n");
//			post(scaleto.join(" "));
			for (i = 0;i < coord.length;i++){
				scaled[i]=joex.lscale(coord[i],scalefrom[i],scaleto[i]);
			}
			bang();
		}
		else {
			post("\nInvalid Coord. List\n");
		}
		break;
	case 1:
		if ((l.length > 1) && (l.length%2 == 0) && (l.length < 7)){
			var i,j;
			for (i = 0;i < l.length;i++){
				if (i%2==0){
					j = i/2;
					scalefrom[j][0]=parseFloat(l[i]);
				}
				else {
					j = (i-1)/2;
					scalefrom[j][1]=parseFloat(l[i]);
				}
			}
		}
		else {
			post("\nInvalid Coord. Source Size List\n")
		}
		break;
	}
}