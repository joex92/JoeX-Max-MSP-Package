inlets = 1
outlets = 6

function splitlist (l) {
	var lab = new Array(2);
	if ((l.length % 2)==0) {
		var ia = 0;
		var ib = 0;
		var a = [];
		var b = [];
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

function dft(inl,op) {
	if (inl.length > 1)  {
		var x = splitlist(inl)[0];
		var y = splitlist(inl)[1];
		var arr_re = new Array();
		var arr_im = new Array();
		var arr_freq = new Array();
		var arr_amp = new Array();
		var arr_phase = new Array();
		var arr_X = new Array();
		var N = Math.floor(inl.length / 2);
		for (var k = 0; k < N; k++) {
			var re = 0;
			var im = 0;
			for (var n = 0; n < N; n++) {
				var phi = (2 * Math.PI * k * n) / N;
				var u = Math.cos(phi);
				var v = Math.sin(phi);
				re += (x[n]*u)-(y[n]*v);
				im -= (x[n]*v)+(y[n]*u);
			}
			re = re / N;
			im = im / N;
			var freq = k;
			var amp = Math.sqrt(re * re + im * im);
			var phase = Math.atan2(im, re);
			arr_re[k] = re;
			arr_im[k] = im;
			arr_freq[k] = freq;
			arr_amp[k] = amp;
			arr_phase[k] = phase;
			arr_X[k] = [re,im,freq,amp,phase];
		}
		if (op == 0) {
			return arr_re;
		}
		if (op == 1) {
			return arr_im;
		}
		if (op == 2) {
			return arr_freq;
		}
		if (op == 3) {
			return arr_amp;
		}
		if (op == 4) {
			return arr_phase;
		}
		if (op == 5) {
			return arr_X;
		}
		else {
			return [0];
		}
	}
	else {
		return 0;
	}
}

function list() {
	var args = joex.GetArgs(jsarguments);
	var Op = 0;
	if(args.length == 1)
	{
		Op = args[0];
	}
	var Xk = arrayfromargs(arguments);
	if (Op == 0) {
		var lre = [];
		var lim = [];
		var lfreq = [];
		var lamp = [];
		var lphase = [];
		var lXk = [];
		for (var i = 0; i < Math.floor(Xk.length / 2); i++) {
			for (var n = 0; n < 5 ; n++) {
				lXk[(i*5)+n] = dft(Xk,n)[i];
			}
			lre[i] = dft(Xk,0)[i];
			lim[i] = dft(Xk,1)[i];
			lfreq[i] = dft(Xk,2)[i];
			lamp[i] = dft(Xk,3)[i];
			lphase[i] = dft(Xk,4)[i];
		}
		outlet(5,lXk)
		outlet(4,lphase)
		outlet(3,lamp)
		outlet(2,lfreq)
		outlet(1,lim)
		outlet(0,lre)
	}
	else {
		for (var i = 0; i < Xk.length; i++) {
			outlet(5,dft(Xk,5)[i])
			outlet(4,dft(Xk,4)[i])
			outlet(3,dft(Xk,3)[i])
			outlet(2,dft(Xk,2)[i])
			outlet(1,dft(Xk,1)[i])
			outlet(0,dft(Xk,0)[i])
		}
	}
}