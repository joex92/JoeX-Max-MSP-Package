autowatch=1
inlets=1
outlets=1

function list(){
	l = joex.ArrToi0obji1Num(arrayfromargs(arguments));
	outlet(0, joex.areEquals(l[1][0],l[1][1]));
}

function anything(){
	l = joex.ArrToi0obji1Num(arrayfromargs(arguments));
	outlet(0, l[0].join(" ")+" "+l[1].join(" "));
}