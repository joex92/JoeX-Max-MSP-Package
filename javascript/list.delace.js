inlets = 1
outlets = 2

function splitlist (l) {
	var lab = new Array(2);
	if ((l.length % 2)==0) {
		var ia = 0;
		var ib = 0;
		var a = new Array();
		var b = new Array();
		for (var i = 0 ; i < l.length ; i++ ){
			if ((i%2) == 0){
				a[ia] = l[i];
				ia++;
			}
			else {
				b[ib] = l[i];
				ib++;
			}
		}
		lab[0] = a;
		lab[1] = b;
	}
	else {
		lab[0] = [0];
		lab[1] = [0];
	}
	return lab;
}

function list(){
	var inl = arrayfromargs(arguments);
	var x = splitlist(inl)[0];
	var y = splitlist(inl)[1];
	outlet(0,x)
	outlet(1,y)
}