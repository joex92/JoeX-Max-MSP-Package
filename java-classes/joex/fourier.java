package joex;
import java.util.*;
import com.cycling74.msp.*;

public class fourier extends MSPPerformer {
	public static float[][] points,dft,dftx,dfty,fft,fftx,ffty;
	public static float[] px,py;
	public static float resolution = 1;
	private static int op = -1;
	private static float TWO_PI = (float) (2 * Math.PI);
	private static float rot;
	private static boolean firstp;
	private static float prevt,prevx,prevy;
	
	public fourier (String[] s) {
		declareInlets(new int[]{SIGNAL,SIGNAL});
		declareOutlets(new int[]{SIGNAL,SIGNAL});
		setInletAssist(0, "Phasor Signal [0-1]");
		setInletAssist(1, "Rotation Signal [Degrees]");
		setOutletAssist(0, "Signal X");
		setOutletAssist(1, "Signal Y");
		clear();
		if (s[0].equals("dft")) {
			op = 0;
			post("dft selected");
		}
		else if(s[0].equals("fft")) {
			op = 1;
			post("fft selected");
		}
		else {
			post("Invalid fourier transform");
		}
	}
	
//	public void inlet (float f) {
//		rot = (f/360)*TWO_PI;
//	}
	
	public void print(String[] s) {
		if (s[0].equals("points")) {
			float[] output = new float[points.length*2];
			if (points.length > 0) {
				for (int i = 0 ; i < points.length ; i++) {
					output[2*i] = points[i][0];
					output[2*i+1] = points[i][1];
				}
			}
			outlet(2,output);
		}
		else {
			post("Wrong value.");
		}
	}
	
	public void length() {
		outlet(1,points.length);
	}
	
	public void resolution(float res) {
		resolution = res;
	}
	
	public void clear() {
		firstp = true;
		rot = 0;
		points = new float[][] {new float[] {0,0},new float[] {0,0}};
		px = new float[] {0,0};
		py = new float[] {0,0};
		dft = dftxy(points);
		dftx = dft(px);
		dfty = dft(py);
		fft = dftxy(points);
		fftx = dft(px);
		ffty = dft(py);
		post("Points cleared.");
	}
	
	public void list (float[] f) {
		if (f.length == 2) {
			if (firstp) {
				points = new float[0][0];
				px = new float[0];
				py = new float[0];
				firstp = false;
			}
			points = Arrays.copyOf(points, points.length + 1);
			points[points.length - 1] = new float[2];
			points[points.length - 1][0] = f[0];
			points[points.length - 1][1] = f[1];
			px = Arrays.copyOf(px, px.length + 1);
			px[px.length - 1]=f[0];
			py = Arrays.copyOf(py, py.length + 1);
			py[py.length - 1]=f[1];
			post(points[points.length - 1][0]+" "+points[points.length - 1][1]+"\n");
		}
		else {
			post("2 floats list is needed");
		}
		if (op == 0) {
			dft = dftxy(points);
			dftx = dft(px);
			dfty = dft(py);
		}
		else if (op == 1) {
			fft = fftxy(points);
			fftx = fft(px);
			ffty = fft(py);
		}
		outlet(2,points.length);
	}
	
	private float[][] dft(float[] x) {
		  float[][] X = new float[0][5];
		  float N = x.length;
		  for (int k = 0; k < N; k++) {
		    float re = 0;
		    float im = 0;
		    for (int n = 0; n < N; n++) {
		      float phi = (TWO_PI * k * n) / N;
		      re += x[n] * Math.cos(phi);
		      im -= x[n] * Math.sin(phi);
		    }
		    re = re / N;
		    im = im / N;
		    float freq = k;
		    float amp = (float)Math.sqrt(re * re + im * im);
		    float phase = (float)Math.atan2(im, re);
		    X = Arrays.copyOf(X, X.length + 1);
		    X[k] = new float[]{ re, im, freq, amp, phase };
		  }
		  Arrays.sort(X, Comparator.comparingDouble(o -> o[3]));
		  return X;
		}

	private float[][] dftxy(float[][] p) {
	  float[][] X = new float[0][0];
	  int N = p.length;
	  for (int k = 0; k < N; k++) {
	    float re = 0;
	    float im = 0;
	    for (int n = 0; n < N; n++) {
	      float phi = (float) ((TWO_PI * k * n) / N);
	      float[] c = {(float)Math.cos(phi),(float)-Math.sin(phi)};
	      re += ((p[n][0] * c[0]) - (p[n][1] * c[1]));
	      im += ((p[n][0] * c[1]) + (p[n][1] * c[0]));
	    }
	    re = re / N;
	    im = im / N;
	    float freq = k;
	    float amp = (float) Math.sqrt(re * re + im * im);
	    float phase = (float) Math.atan2(im, re);
	    X = Arrays.copyOf(X, X.length + 1);
	    X[k] = new float[]{ re, im, freq, amp, phase };
	  }
	  Arrays.sort(X, Comparator.comparingDouble(o -> o[3]));
	  return X;
	}
	
	private float[][] fft(float[] x) {
		  float[][] X = new float[0][5];
		  float N = x.length;
		  for (int k = 0; k < N; k++) {
		    float re = 0;
		    float im = 0;
		    for (int n = 0; n < N; n++) {
		      float phi = (TWO_PI * k * n) / N;
		      re += x[n] * Math.cos(phi);
		      im -= x[n] * Math.sin(phi);
		    }
		    re = re / N;
		    im = im / N;
		    float freq = k;
		    float amp = (float)Math.sqrt(re * re + im * im);
		    float phase = (float)Math.atan2(im, re);
		    X = Arrays.copyOf(X, X.length + 1);
		    X[k] = new float[]{ re, im, freq, amp, phase };
		  }
		  return X;
		}
	
	private float[][] fftxy(float[][] p){
		  float[][] X = new float[0][0];
		  int N = p.length;
		  for (int k = 0; k < N; k++) {
		    float re = 0;
		    float im = 0;
		    for (int n = 0; n < N; n++) {
		      float phi = (float) ((TWO_PI * k * n) / N);
		      float[] c = {(float)Math.cos(phi),(float)-Math.sin(phi)};
		      re += ((p[n][0] * c[0]) - (p[n][1] * c[1]));
		      im += ((p[n][0] * c[1]) + (p[n][1] * c[0]));
		    }
		    re = re / N;
		    im = im / N;
		    float freq = k;
		    float amp = (float) Math.sqrt(re * re + im * im);
		    float phase = (float) Math.atan2(im, re);
		    X = Arrays.copyOf(X, X.length + 1);
		    X[k] = new float[]{ re, im, freq, amp, phase };
		  }
//		  Arrays.sort(X, Comparator.comparingDouble(o -> o[3]));
		  return X;
	}
	
	private float[] epicycles(float time,float rotation,float[][] fourier) {
	  float x=0,y=0;
	  float[] xy = new float[fourier.length];
	  int i;//=(int)Math.floor(time*(fourier.length-1));
	  int l=(int)Math.min(Math.max(Math.round(fourier.length*resolution),0),fourier.length);
	  if (prevt != time) {
		  for (i = 0; i < l; i++) {
			float tx, ty;
//			float re = fourier[i][0];
//			float im = fourier[i][1];
		    float freq = fourier[i][2] * time;
		    float radius = fourier[i][3];
		    float phase = fourier[i][4];
		    tx = radius * (float)Math.cos(freq + phase + rotation);
		    ty = radius * (float)Math.sin(freq + phase + rotation);
		    x = prevx + tx;
		    y = prevy + ty;
		    prevx = x;
		    prevy = y;
		  }
		  prevt = time;
	  }
	  xy[0] = x;
	  xy[1] = y;
	  return xy;
	}
	
//	private float lscale(float value,float[] from,float[] to) {
//		float fromsize = from[1] - from[0];
//		float tosize = to[1] - to[0];
//		float op;
//		if (fromsize < 0){
//			op = ((value/fromsize) * tosize) - to[0];
//		}
//		else if (tosize < 0){
//			op = to[0] - ((value/fromsize) * tosize);
//		}
//		else {
//			op = ((value/fromsize) * tosize) + to[0];
//		}
//		return op;
//	}

	@Override
	public void perform(MSPSignal[] ins, MSPSignal[] outs)
	{
		int i;
		float[] in1 = ins[0].vec;
		int in1l = in1.length;
		float[] in2 = ins[1].vec;
		float[] outX = outs[0].vec;
		float[] outY = outs[1].vec;
		if (ins[0].connected) {
			post("\n"+in1l);
			for(i = 0; i < in1l;i++){
				rot = (in2[i]/360)*TWO_PI;
				if (op == 0) {
					float[] dftP = epicycles(Math.abs(in1[i])*TWO_PI,rot,dft);
					outX[i] = dftP[0];//epicycles(Math.abs(in1[i])*TWO_PI,rot,dftx)[0];
					outY[i] = dftP[1];//epicycles(Math.abs(in1[i])*TWO_PI,rot,dfty)[0];
				}
				else if (op == 1) {
					float[] fftP = epicycles(Math.abs(in1[i])*TWO_PI,rot,fft);
					outX[i] = fftP[0];//epicycles(Math.abs(in1[i])*TWO_PI,rot,fftx)[0];
					outY[i] = fftP[1];//epicycles(Math.abs(in1[i])*TWO_PI,rot,ffty)[0];
				}
				else {
					outX[i] = (float) Math.cos(in1[i]*TWO_PI);
					outY[i] = (float) Math.sin(in1[i]*TWO_PI);
				}
	
			}
		}
		else {
		}
	}
}