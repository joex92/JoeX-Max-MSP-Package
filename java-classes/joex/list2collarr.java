/* ALMOST FINISHED
 * the idea of this object is to add incoming lists to an array of lists (array of arrays),
 * and then output them in the same order as separated signals,
 * so you initialize it with, at least, the amount of outlets you'll need.
 * */

package joex;
import java.util.Arrays;
import com.cycling74.msp.*;

public class list2collarr extends MSPPerformer {
	public static float[][] l;
	private static float[][] linit;
	private static boolean tidle,_idle,_debug;
	private static int OUTLETS, MAX_LENGTH;
	private static int[] OUTLETS_DECLARE;
	
	public list2collarr (int outlets, int maxlength) {
		_debug = false;
		declareInlets(new int[]{SIGNAL});
		MAX_LENGTH = 0;
		OUTLETS = 2;
		l = new float[1][outlets];
		OUTLETS_DECLARE = new int[]{SIGNAL,SIGNAL};
		setOutletAssist(0, "Index signal output");
		if (outlets >= 0) {
			OUTLETS = OUTLETS + outlets;
			OUTLETS_DECLARE = Arrays.copyOf(OUTLETS_DECLARE, OUTLETS);
			for (int i = 1 ; i < OUTLETS_DECLARE.length - 1 ; i++) {
				OUTLETS_DECLARE[i] = SIGNAL;
				setOutletAssist(i, "Signal "+i);
			}
		}
		linit = new float[1][0];
		linit[0] = new float[OUTLETS-2];
		clear();
		OUTLETS_DECLARE[OUTLETS - 1] = SIGNAL;
		setOutletAssist(OUTLETS - 1, "Array length signal");
		declareOutlets(OUTLETS_DECLARE);
		setInletAssist(0, "Index signal input / Float lists / Messages");
		if (maxlength > 0) {
			MAX_LENGTH = maxlength;
		}
	}
	public void inlet (int length) {
		if (length > 0) {
			MAX_LENGTH = length;
			if (l.length > MAX_LENGTH) {
				float[][] ltemp = new float[MAX_LENGTH][OUTLETS-2];
				if (MAX_LENGTH == 1) {
					for (int i = 0;i < l[0].length;i++) {
						ltemp[0][i] = l[0][i];
					}
				}
				else {
					System.arraycopy(l, 1, ltemp, 0, MAX_LENGTH-1);
				}
				l = ltemp;
			}
		}
		else {
			MAX_LENGTH = 0;
		}
	}
	
	public void bang() {
		dump(0);
	}
	
	public void dump(int t) {
		float[] output = new float[0];
		int ilength;
		if (l.length > 0) {
			if (t == 0) {
				for (int i = 0 ; i < l.length ; i++) {
					ilength = l[i].length + 1;
					post(i+":"+ilength);
					output = Arrays.copyOf(output, ilength);
					for (int j = 0 ; j < ilength ; j++) {
						if (j == 0) {
							output[j] = i;
						}
						else {
							output[j] = l[i][j-1];
						}
					}
					outlet(OUTLETS,output);
				}
			}
			else {
				for (int i = 0 ; i < l.length ; i++) {
					ilength = l[i].length + 1;
					post(i+":"+ilength);
					for (int j = 0 ; j < ilength ; j++) {
						output = Arrays.copyOf(output, output.length + 1);
						if (j == 0) {
							output[ilength*i] = i;
						}
						else {
							output[ilength*i+j] = l[i][j-1];
						}
					}
				}
				outlet(OUTLETS,output);
			}
		}
	}
	
	public void length() {
		outlet(1,l.length);
	}
	
	public void clear() {
		_idle = false;
		tidle = false;
		l = Arrays.copyOf(linit, linit.length);
		l[0] = Arrays.copyOf(linit[0], linit[0].length);
		post("Array cleared");
	}
	
	public void debug(int d) {
		if (d != 0) {
			_debug = true;
			post("Debugging enabled");
		}
		else {
			_debug = false;
			post("Debugging disabled");
		}
	}
	
	public void idle (int t) {
		if (t == 0) {
			tidle = false;
			_idle = false;
			if (l.length != 0) {
				float[][] ltemp = new float[l.length-1][OUTLETS-2];
				System.arraycopy(l, 0, ltemp, 0, ltemp.length);
				l = ltemp;
			}
			else {
				clear();
			}
		}
		else {
			tidle = true;
		}
	}
	
	public void idle (float[] f) {
		if (tidle) {
			if (!_idle && l.length > 1) {
				l = Arrays.copyOf(l, l.length + 1);
			}
			_idle = true;
			l[l.length - 1] = new float[OUTLETS-2];
			l[l.length - 1] = Arrays.copyOf(f, OUTLETS-2);
			if (_debug) {
				String postout = "";
				for (int i = 0 ; i < l[l.length - 1].length ; i++) {
					postout = postout + " " + l[0][i];
				}
				post("debug idle "+l.length+" "+postout);
				outlet(OUTLETS,"debug idle "+l.length+" "+postout);
			}
		}
	}
	
	public void list (float[] f) {
		_idle = false;
		if ((MAX_LENGTH > 0) && (l.length == MAX_LENGTH)) {
			if (MAX_LENGTH == 1) {
				l = new float [1][0];
			}
			else {
				float[][] ltemp = new float[MAX_LENGTH][OUTLETS-2];
				System.arraycopy(l, 1, ltemp, 0, MAX_LENGTH-1);
				l = ltemp;
			}
		}
		else {
			boolean _linit = true;
			if (l.length == linit.length) {
				if (l[0].length == linit[0].length) {
					for (int i = 0;i < l[0].length;i++) {
						_linit = _linit && (l[0][i] == linit[0][i]);
					}
				}
				else {
					_linit = false;
				}
			}
			else {
				_linit = false;
			}
			if (_linit) {
				l = new float[0][0];
			}
			l = Arrays.copyOf(l, l.length + 1);
		}
		l[l.length - 1] = new float[OUTLETS-2];
		l[l.length - 1] = Arrays.copyOf(f, OUTLETS-2);
		if (_debug) {
			String postout = "";
			for (int i = 0 ; i < l[l.length - 1].length ; i++) {
				postout = postout + " " + l[0][i];
			}
			post("0 "+postout);
			postout = "";
			for (int i = 0 ; i < l[l.length - 1].length ; i++) {
				postout = postout + " " + l[l.length - 1][i];
			}
			post("debug list "+l.length+" "+postout);
			outlet(OUTLETS,"debug list "+l.length+" "+postout);
		}
	}

	@Override
	public void perform(MSPSignal[] ins, MSPSignal[] outs)
	{
		int i,j,k;
		float v;
		boolean inBounds;
		float[] in = ins[0].vec;
		for (i = 1; i < OUTLETS - 1 ; i++) {
			for(j = 0; j < in.length;j++) {
				inlet(Math.round(ins[1].vec[j]));
				if (l.length > 0) {
					k = (int)Math.abs((in[j]*(l.length))-(in[j]*(l.length))%1);
				}
				else {
					k = (int)0;
					v = (float)0;
				}
				outs[0].vec[j] = k;
				inBounds = (i-1 >= 0) && (i-1 < l[k].length);
				if (inBounds) {
					v = l[k][i-1];
				}
				else {
					v = (float)0;
				}
				outs[i].vec[j] = v;
				if (l.length > 0) {
					outs[OUTLETS-1].vec[j] = l.length;
				}
				else {
					outs[OUTLETS-1].vec[j] = 0;
				}
			}
		}
	}
}