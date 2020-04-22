package joex;
import com.cycling74.jitter.*;
import com.cycling74.max.*;
import com.cycling74.msp.*;
import java.lang.reflect.Method;
import java.util.*;
public class matrix2array extends MSPPerformer {
	public static JitterMatrix jm;
	public static String jms;
	private static int OUTLETS = 5;
	private static int[] OUTLETS_DECLARE,dim,diminit;
	public static int[][] l,linit,lsnap;
	private static boolean first=true;
	private static int planecount=0;
	private static float v=0,vt=0;
	private static float[][] scalefrom;
	private static float[][] scaleto;
	
	public matrix2array(int pc) {
		planecount = pc;
		declareInlets(new int[]{SIGNAL});
		OUTLETS_DECLARE = new int[]{SIGNAL,SIGNAL};
		setOutletAssist(0, "Index signal output");
		OUTLETS_DECLARE = Arrays.copyOf(OUTLETS_DECLARE, OUTLETS);
		for (int i = 1 ; i < OUTLETS_DECLARE.length - 1 ; i++) {
			OUTLETS_DECLARE[i] = SIGNAL;
			setOutletAssist(i, "Signal "+i);
		}
		linit = new int[0][3];
		lsnap = new int[0][3];
		diminit = new int[2];
		clear();
		OUTLETS_DECLARE[OUTLETS - 1] = SIGNAL;
		setOutletAssist(OUTLETS - 1, "Array length signal");
		declareOutlets(OUTLETS_DECLARE);
		setInletAssist(0, "Index signal input / Messages");
	}
	
	public void clear() {
		scalefrom = new float[][] {new float[] {-1,1},new float[] {1,-1}};
		scaleto = new float[][] {new float[] {-1,1},new float[] {-1,1}};
		jms = "";
		dim = Arrays.copyOf(diminit, diminit.length);
		l = Arrays.stream(linit).map(int[]::clone).toArray(int[][]::new);
		first = true;
		post("Array cleared");
	}
	
	private float lscale(float value,float[] from,float[] to) {
		float fromsize = from[1] - from[0];
		float tosize = to[1] - to[0];
		float op;
		if (fromsize < 0){
			op = ((value/fromsize) * tosize) - to[0];
		}
		else if (tosize < 0){
			op = to[0] - ((value/fromsize) * tosize);
		}
		else {
			op = ((value/fromsize) * tosize) + to[0];
		}
		return op;
	}
	
	public void jit_matrix(String s){
		try {
			jms = s;
			JitterMatrix jm = new JitterMatrix(jms);
			if (dim[0] != Arrays.copyOf(jm.getDim(), jm.getDim().length)[0] && dim[1] != Arrays.copyOf(jm.getDim(), jm.getDim().length)[1]) {
				first = true;
			}
			if (first) {
				post("\nchanged");
				dim = Arrays.copyOf(jm.getDim(), jm.getDim().length);
				scalefrom = new float[][] {new float[] {0,dim[0]},new float[] {dim[1],0}};
				l = new int[dim[0]*dim[1]][3];
				int x,y,i=0;
				for (x = 0;x < dim[0];x++) {
					for(y = dim[1]-1;y > -1 ;y--) {
						l[i] = new int[] {1,x,y};
						i++;
					}
				}
				if (first){
					first = false;
				}
				outlet(OUTLETS,dim);
			}
		}catch (Exception e) {
			post("\n"+e.getMessage());
		} finally {clear();}
		
	}
	public void bang() {
		try {
			JitterMatrix j = new JitterMatrix(jms);
			float[] jarr = new float[j.getDim()[0]*j.getDim()[1]];
//			int x,y,i=0;
//			for (x = 0;x < dim[0];x++) {
//				for(y = dim[1]-1;y > -1 ;y--) {
//					if (j.getcell2dInt(x, y)[planecount] != 0) {
//						lsnap = Arrays.copyOf(lsnap, lsnap.length+1);
//						lsnap[i] = new int[] {i,1,x,y};
//						outlet(OUTLETS,lsnap[i]);
//						i++;
//					}
//				}
//			}
			outlet(OUTLETS,jarr.length+" "+(j.getDim()[0]*j.getDim()[1]));
		}catch (Exception e) {
			post("\n"+e.getMessage());
		} finally {}
	}
	
	public void inlet (int i) {
		JitterMatrix j = new JitterMatrix(jms);
		float[] jarr = new float[j.getDim()[0]*j.getDim()[1]];
		j.copyMatrixToArray(jarr);
		outlet(OUTLETS,jarr[i]);
	}
	
	@Override
	public void perform(MSPSignal[] ins, MSPSignal[] outs)
	{
		JitterMatrix j = new JitterMatrix(jms);
		int o,i,k;
		boolean inBounds;
		float[] in = ins[0].vec;
		for (o = 1; o < OUTLETS - 1 ; o++) {
			for(i = 0; i < in.length;i++) {
				if (l.length > 0) {
					k = (int)Math.abs((in[i]*(l.length-1))-(in[i]*(l.length-1))%1);
				}
				else {
					k = (int)0;
					v = (float)0;
				}
				outs[0].vec[i] = k;
				inBounds = (o-1 >= 0) && (o-1 < l[k].length);
				if (inBounds) {	
					switch (o) {
						case 1:
							vt = j.getcell2dFloat(l[k][0], l[k][1])[planecount]/255;
							break;
						case 2:
							vt = lscale((float)l[k][o-1],scalefrom[0],scaleto[0]);
							break;
						case 3:
							vt = lscale((float)l[k][o-1],scalefrom[1],scaleto[1]);
							break;
						default:
							vt = 0;
					}
					v = vt;
				}
				else {
					v = (float)0;
				}
				outs[o].vec[i] = v;
				if (l.length > 0) {
					outs[OUTLETS-1].vec[i] = l.length;
				}
				else {
					outs[OUTLETS-1].vec[i] = 0;
				}
			}
		}
	}
}
