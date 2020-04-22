autowatch = 1
inlets = 1
outlets = 1

var p0=[],p1=[],pl=[];

function list (){
	var l = arrayfromargs(messagename, arguments);
	if (l.length == 2){
		var first;
		l[0] = parseFloat(l[0]);
		l[1] = parseFloat(l[1]);
		if (p0.length != 2){
			p0 = joex.copy(l);
			first = true;
		}
		else{
			p1 = joex.copy(l);
			first = false;
		}
		if (first){
			pl=[1,joex.copy(p0[0]),joex.copy(p0[1])]
			bang();
		}
		else {
			pl=[2,joex.copy(p0[0]),joex.copy(p0[1]),joex.copy(p1[0]),joex.copy(p1[1]),1]
			p0 = joex.copy(p1);
			bang();
		}
	}
	else {
		anything();
	}
}

function bang(){
	outlet(0,pl);
}

function clear(){
	first = true;
	p0 = [];
	p1 = [];
	pl = [];
}

function anything(){
	post("Invalid input");
}