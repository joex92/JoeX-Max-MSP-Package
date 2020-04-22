package joex;
import com.cycling74.max.*;

public class testmax extends MaxObject {

  public void bang() {
	  post("this is a test.");
	  outlet(0, "this is a test.");
  }
}