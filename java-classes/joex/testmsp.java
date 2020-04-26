/* TESTING FILE */

package joex;
import com.cycling74.msp.*;

public class testmsp extends MSPPerformer
{
	private float _out = 0;
	
	private static final String[] INLET_ASSIST = new String[]{
		"input (sig)"
	};
	private static final String[] OUTLET_ASSIST = new String[]{
		"output (sig)"
	};
	

	public testmsp(float sel)
	{
		declareInlets(new int[]{SIGNAL});
		declareOutlets(new int[]{SIGNAL,SIGNAL});

		setInletAssist(INLET_ASSIST);
		setOutletAssist(OUTLET_ASSIST);

		_out = sel;
	}

	public void inlet(int i) {
		inlet((float) i);
	}
	
	public void inlet(float f)
	{
		switch (getInlet()) {
			case 0:
				_out = f;
				break;
			default:
				post("err");
				break;
		}
	}

	public void dspsetup(MSPSignal[] ins, MSPSignal[] outs)
	{
		//If you forget the fields of MSPSignal you can select the classname above
		//and choose Open Class Reference For Selected Class.. from the Java menu
	}

	public void perform(MSPSignal[] ins, MSPSignal[] outs)
	{
		
		int i;
		float[] in = ins[0].vec;
		float[] out = outs[(int)_out].vec;
		for(i = 0; i < in.length;i++)
		{
			/*do something*/
			out[i] = in[i];  	

		}
	}
}


