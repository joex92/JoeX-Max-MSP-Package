inlets=2
outlets=2
var drawing = [];
var args = joex.GetArgs(jsarguments)[1];
var mv, rot, corners;
if (args.length == 3){
    mv = [args[0],args[1]];
    rot = args[2];
}
else {
	clear();
}

move(mv);
rotate(rot);
function clear(){
	drawing = [];
	mv = [0,0];
	rot = 0;
}
function size(){
	var td,xl,yl,Xm,XM,Ym,YM,s=[0,0,0,0];
	td = joex.copy(drawing);
	if (td.length > 1){
		var i;
		for (i = 0;i < td.length;i++){
			xl[i]=td[i][0];
			yl[i]=td[i][0];
		}
		xl.sort(function(a, b){return a - b});
		yl.sort(function(a, b){return a - b});
		Xm = xl[0];
		XM = xl[xl.length-1];
		Ym = yl[0];
		YM = yl[xl.length-1];
		corners = [
			[Xm,XM],
			[Ym,YM]
		]
		s = [
			corners[0][0],corners[0][1],
			corners[1][0],corners[1][1]];
	}
	return s;
}
function move(p){
	for(m = 0;m < drawing.length;m++){
		drawing[m][0] = drawing[m][0] - p[0];
		drawing[m][1] = drawing[m][1] - p[1];
	}
}
function car2pol(xy){
	var x = xy[0];
	var y = xy[1];
    var distance = Math.sqrt(x*x + y*y);
    var radians = Math.atan2(y,x); //This takes y first
    var polarCoor = [distance, radians];
    return polarCoor;
}
function pol2car(dr){
	var d = dr[0];
	var r = dr[1];
	var x = d*Math.cos(r);
	var y = d*Math.sin(r);
    var cartesianCoor = [x, y];
    return cartesianCoor;
}
function rotate(R){
	var pol,car;
	for(m = 0;m < drawing.length;m++){
		pol = car2pol(drawing[m]);
		pol[1] = pol[1] + R;
		drawing[m] = pol2car(pol);
	}
}
function add(c){
	drawing[drawing.length] = joex.copy(l);
}
function list(){
	var l = joex.ArrToi0obji1Num(arrayfromargs(messagename, arguments))[1];
	switch (inlet){
		case 0:
			if (l.length == 2){
				add(l);
				outlet(1,size());
			}
			break;
		case 1:
			if (l.length == 2){
				move(l);
			}
			break;
	}
}
function msg_float(f){
	switch (inlet){
	case 0:
		break;
	case 1:
		rotate((f/180.0)*Math.PI);
		break;
}
}
function bang(){
	outlet(1,size);
	var out = [-1,2,0,0,0,0,1];
	for (i = 0;i < drawing.length;i++){
		if (i%2 == 0){
			out[0] = i/2
			out[2] = joex.lscale(drawing[i][0],scalefrom[0],scaleto[0]);
			out[3] = joex.lscale(drawing[i][1],scalefrom[1],scaleto[1]);
		}
		else {
			out[4] = joex.lscale(drawing[i][0],scalefrom[0],scaleto[0]);
			out[5] = joex.lscale(drawing[i][1],scalefrom[1],scaleto[1]);
			outlet(0,out);
		}
	}
	
}

function msg_int(index){
	outlet(1,size);
	var out = [-1,1,0,0];
	if ((index >= 0)&&(index<drawing.length)){
		out[0] = index;
		out[2] = joex.lscale(drawing[index][0],scalefrom[0],scaleto[0]);
		out[3] = joex.lscale(drawing[index][1],scalefrom[1],scaleto[1]);
	}
	outlet(0,out);
}
function anything(){
	post("Only Bang or Int");
}
