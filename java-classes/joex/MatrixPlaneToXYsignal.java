/* ALMOST FINISHED
 * like the list2collarr file, this one instead of taking lists,
 * it takes a matrix plane and convert it to an array of arrays
 * and output it as signal.
 * */

package joex;
import com.cycling74.jitter.*;
import com.cycling74.msp.*;
import java.lang.management.*;
import java.lang.reflect.Method;
import java.util.*;
public class MatrixPlaneToXYsignal extends MSPObject {
	private static final int MEGABYTE = (1024*1024);
	public static JitterMatrix jm;
	public static String jms;
	private static int OUTLETS = 4;
	private static int[] OUTLETS_DECLARE,dim,diminit;
	public static int[][] l,linit,lsnap;
	private static boolean first=true;
	private static int plane=0;
	private static float v=0,vt=0,TWO_PI=(float)(Math.PI*2);
	private static float[][] scalefrom;
	private static float[][] scaleto;
    private static MemoryUsage heapUsage;
	public float freq = 0.f;
	public float phase = 0.f;
	private int L; //table length
	private double _sr;//sampling rate
	private float _index;//current index
	private float _inc;//current increment
	private Method _p0 = null;
	private Method _p1 = null;
    
	public MatrixPlaneToXYsignal(int p) {
		plane = p;
		OUTLETS_DECLARE = new int[]{SIGNAL,SIGNAL,SIGNAL,SIGNAL};
		declareInlets(new int[]{SIGNAL});
		declareOutlets(OUTLETS_DECLARE);
		setInletAssist(0, "(Signal) Input / Messages");
		setOutletAssist(0, "(Signal) Index");
		setOutletAssist(1, "(Signal) Value");
		setOutletAssist(2, "(Signal) X Signal");
		setOutletAssist(3, "(Signal) Y Signal");
		linit = new int[0][3];
		diminit = new int[2];
		clear();
	}
	
	public void jit_matrix(String s){
		try {
			jms = s;
			jm = new JitterMatrix(jms);
			if (dim[0] != Arrays.copyOf(jm.getDim(), jm.getDim().length)[0] && dim[1] != Arrays.copyOf(jm.getDim(), jm.getDim().length)[1]) {
				first = true;
			}
			if (first) {
				dim = Arrays.copyOf(jm.getDim(), jm.getDim().length);
				scalefrom = new float[][] {new float[] {0,dim[0]-1},new float[] {dim[1]-1,0}};
				MatrixPlaneToArray(jm,l);
				if (first){
					first = false;
				}
				outlet(OUTLETS,dim);
			}
		}catch (Exception e) {
			post("\n"+e.getMessage());
        } catch (OutOfMemoryError e) {
        	RAM();
        } finally {}
		
	}
	
	public void RAM() {
	    MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
    	heapUsage = memoryBean.getHeapMemoryUsage();
        long maxMemory = heapUsage.getMax() / MEGABYTE;
        long usedMemory = heapUsage.getUsed() / MEGABYTE;
        outlet(OUTLETS,new String[] {"RAM",usedMemory + "M",maxMemory + "M"});
        post("Memory Use: " + usedMemory + "M/" + maxMemory + "M");
	}
	
	public void clear() {
		scalefrom = new float[][] {new float[] {-1,1},new float[] {1,-1}};
		scaleto = new float[][] {new float[] {-1,1},new float[] {-1,1}};
		jms = "";
		dim = Arrays.copyOf(diminit, diminit.length);
		lsnap = Arrays.stream(linit).map(int[]::clone).toArray(int[][]::new);
		first = true;
		post("Array cleared");
		_p0 = getPerformMethod("p0");
		_p1 = getPerformMethod("p1");
	}
	
	private void MatrixPlaneToArray(JitterMatrix m,int[][] arr){
		int[] mdim = Arrays.copyOf(m.getDim(), m.getDim().length);
		arr = new int[mdim[0]*mdim[1]][3];
		int i,j,k=0;
		for (i = 0;i < mdim[0];i++) {
			for (j = mdim[1]-1;j > -1;j--) {
				arr[k] = new int[] {jm.getcell2dInt(i, j)[plane],i,j};
				k++;
			}
		}
		post("Array changed");
	}
	
	private float lscale(float value,float[] from,float[] to) {
		float fromsize = from[1] - from[0];
		float tosize = to[1] - to[0];
		float op;
		if (fromsize < 0 && tosize > 0){
			op = ((value/fromsize) * tosize) - to[0];
		}
		else {
			op = ((value/fromsize) * tosize) + to[0];
		}
		return op;
	}
	
	private float clip(float val,float min,float max){
		return Math.min(Math.max(val,min),max);
	}
	
	public void bang() {
		try {
			int x,y,i=0;
			for (x = 0;x < dim[0];x++) {
				for(y = dim[1]-1;y > -1 ;y--) {
					if (jm.getcell2dInt(x, y)[plane] != 0) {
						lsnap = Arrays.copyOf(lsnap, lsnap.length+1);
						lsnap[i] = new int[] {i,1,x,y};
						outlet(OUTLETS,lsnap[i]);
						i++;
					}
				}
			}
		}catch (Exception e) {
			post("\n"+e.getMessage());
		} finally {}
	}
	
	public void inlet (int i) {
		MatrixPlaneToArray(jm,l);
		outlet(OUTLETS,l[i]);
	}

	public Method dsp(MSPSignal[] ins, MSPSignal[] outs) {
		_sr = outs[0].sr;
		_inc = (float) (freq * L / _sr); 		
		if(ins[0].connected){
			return _p1;
		}
		else
			return _p0;
	}
	
	public void p0(MSPSignal[] ins, MSPSignal[] outs) {
		int i;
		float[] outX = outs[2].vec;
		float[] outY = outs[3].vec;
		float p_offset = phase * (L - 1);

		for(i = 0; i < outX.length;i++)
		{
			outX[i] = (float)(Math.cos(((_index*TWO_PI)/(outX.length - 1))+p_offset));
			outY[i] = (float)(Math.sin(((_index*TWO_PI)/(outY.length - 1))+p_offset));	
			_index += _inc;
		}
		_index %= L;
	}
	
	public void p1(MSPSignal[] ins, MSPSignal[] outs) {
		int length,o,i,li=0;
		length = l.length;
		float[] in = ins[0].vec;
		for (o = 1; o < OUTLETS - 1 ; o++) {
			for(i = 0; i < in.length;i++) {
				if (length > 0) {
					li = (int)Math.floor(lscale(Math.abs(clip((float)in[i],0,1)),new float[] {0,1},scalefrom[0]));
					outs[0].vec[i] = li;
					switch (o) {
						case 1:
							vt = jm.getcell2dFloat(l[li][1], l[li][2])[plane]/255;
							break;
						case 2:
							vt = lscale((float)l[li][1],scalefrom[0],scaleto[0]);
							break;
						case 3:
							vt = lscale((float)l[li][2],scalefrom[1],scaleto[1]);
							break;
						default:
							vt = 0;
					}
				}
				else {
					v = (float)0;
				}
				v = vt;
				outs[o].vec[i] = v;
			}
		}
	}
	
	public void perform(MSPSignal[] ins, MSPSignal[] outs){
		p0(ins,outs);
	}

	public void dspsetup(MSPSignal[] ins, MSPSignal[] outs)
	{
		dsp(ins,outs);
	}
}
