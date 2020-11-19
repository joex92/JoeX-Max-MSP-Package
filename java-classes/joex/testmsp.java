/* TESTING FILE */

package joex;

import java.lang.reflect.Method;
import com.cycling74.msp.*;

public class testmsp extends MSPObject{
	
	private static final String[] INLET_ASSIST = new String[]{
		"input (sig)"
	};
	private static final String[] OUTLET_ASSIST = new String[]{
		"output X (sig)","output Y (sig)"
	};
	private static float TWO_PI=(float)(Math.PI*2);
	

	public testmsp(float sel)
	{
		declareInlets(new int[]{SIGNAL});
		declareOutlets(new int[]{SIGNAL,SIGNAL});

		setInletAssist(INLET_ASSIST);
		setOutletAssist(OUTLET_ASSIST);
	}


	public void perform(MSPSignal[] ins, MSPSignal[] outs) {
		int i;
		float[] outX = outs[0].vec;
		float[] outY = outs[1].vec;
		for(i = 0; i < outX.length;i++){
			if (!ins[0].connected) {
					outX[i] = (float)i;//(Math.cos(((i*TWO_PI)/(outX.length - 1))+0));
					outY[i] = (float)i;//(Math.sin(((i*TWO_PI)/(outY.length - 1))+0));
			}
			else {
				outX[i]=ins[0].vec[i];
				outX[i]=ins[0].vec[i]*-1;
			}
		}
		
	}


	@Override
	public Method dsp(MSPSignal[] inlets, MSPSignal[] outlets) {
		perform(inlets,outlets);
		return null;
	}
}


