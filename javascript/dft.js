inlets = 1
outlets = 6

function dft(x) {
  var X = [];
  var N = x.length;
  for (var k = 0; k < N; k++) {
    var re = 0;
    var im = 0;
    for (var n = 0; n < N; n++) {
      var phi = (2 * Math.PI * k * n) / N;
      re += x[n] * Math.cos(phi);
      im -= x[n] * Math.sin(phi);
    }
    re = re / N;
    im = im / N;
    var freq = k;
    var amp = Math.sqrt(re * re + im * im);
    var phase = Math.atan2(im, re);
    X[k] = [ re, im, freq, amp, phase ];
  }
  return X;
}

function list() {
	var args = joex.GetArgs(jsarguments);
	var Op = 0;
	if(args.length == 1)
	{
		Op = args[0];
	}
	var Xk = arguments;
	outlet(5,Xk.length)
	if (Op == 0){
		for (var i = 0; i < Xk.length; i++) {
			outlet(4,dft(Xk)[i][4])
			outlet(3,dft(Xk)[i][3])
			outlet(2,dft(Xk)[i][2])
			outlet(1,dft(Xk)[i][1])
			outlet(0,dft(Xk)[i][0])
		}
	}
	else {
		var lre = [];
		var lim = [];
		var lfreq = [];
		var lamp = [];
		var lphase = [];
		for (var i = 0; i < Xk.length; i++) {
			lre[i] = dft(Xk)[i][0];
			lim[i] = dft(Xk)[i][1];
			lfreq[i] = dft(Xk)[i][2];
			lamp[i] = dft(Xk)[i][3];
			lphase[i] = dft(Xk)[i][4];
		}
		outlet(4,lphase)
		outlet(3,lamp)
		outlet(2,lfreq)
		outlet(1,lim)
		outlet(0,lre)
	}
}