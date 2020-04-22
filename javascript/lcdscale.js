autowatch = 1
inlets = 2
outlets = 3

var ratio = joex.GetArgs(jsarguments)[1],size = [],coord = [],scaled = [],gotsize = false;

if (ratio.length != 2){
	ratio = [1,1];
}

function bang(){
	outlet(0,scaled);
}

function clear(){
	gotsize = false;
	size = [];
	coord = [];
	scaled = [];
}

function list(){
	var l = joex.ArrToi0obji1Num(arrayfromargs(messagename, arguments))[1];
	switch (inlet) {
	case 0:
		if (!gotsize){
			outlet(1,"getsize");
			outlet(2,"getdim");
		}
		var same = false;
		if (size.length == 2){
			if ((parseFloat(l[0]) == parseFloat(coord[0])) && (parseFloat(l[1]) == parseFloat(coord[1]))){
				same = true;
			}
			coord = joex.copy(l);
			var scalefrom = [
				[0.0,size[0]],
				[size[1],0.0]
				];
			var scaleto = [
				[-1*ratio[0],1*ratio[0]],
				[-1*ratio[1],1*ratio[1]]
				];
			if (size[0]>size[1]){
				scalefrom[0][0] = (size[0]-size[1])/2;
				scalefrom[0][1] = size[1]+scalefrom[0][0];
			}
			if (size[1]>size[0]){
				scalefrom[1][0] = (size[1]-size[0])/2;
				scalefrom[1][1] = size[0]+scalefrom[1][0];
			}
			scaled = [
				joex.lscale(coord[0],scalefrom[0],scaleto[0]),
				joex.lscale(coord[1],scalefrom[1],scaleto[1])
			];
			if (!same){
				outlet(0,scaled);
			}
		}
		else {
			post("\nLCD size needed on 2nd inlet\n");
		}
		break;
	case 1:
		if (l.length == 2){
			size = joex.copy(l);
			gotsize = true;
		}
		break;
	}
}