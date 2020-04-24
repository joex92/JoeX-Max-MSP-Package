autowatch = 1;
var joex = new joexUtils();
post("\nJoeX js externals v1.1 (2020/04)\n");

function joexUtils(){
	
	// check if value is number method
	this.isNumber = function (v){
		return (Number(v) < 0) || (Number(v) == 0) || (Number(v) > 0);
	}
	
	// get arguments method
	this.GetArgs = function (jsargs){
	    var args = [[],[]];
		if (jsargs.length > 1){
			var i,j=0,k=0;
			for (i = 1;i < jsargs.length;i++){
				if (this.isNumber(jsargs[i])){
			    	args[1][j]= parseFloat(jsargs[i]);
			    	j++;
				}
				else {
			    	args[0][k]= jsargs[i];
			    	k++;
				}
		    } 
		}
		return args; // returns an array of 2 arrays, the first one of non-number arguments and the second one of number arguments
	}
	
	// convert array of elements to 2 dimensional array of non-numbers and numbers method
	this.ArrToi0obji1Num = function (arr){
	    var marr = [[],[]];
		if (Array.isArray(arr)){
			if (arr.length > 1){
				var i,j=0,k=0;
				for (i = 0;i < arr.length;i++){
					if (this.isNumber(arr[i])){
				    	marr[1][j]= parseFloat(arr[i]);
				    	j++;
					}
					else {
				    	marr[0][k]= arr[i];
				    	k++;
					}
			    } 
			}
		}
		return marr; // returns an array of 2 arrays, the first one of non-number arguments and the second one of number arguments
	}
	
	// linear scale method
	this.lscale = function (value, from, to) {
		var fromsize = parseFloat( from[1] - from[0] );
		var tosize = parseFloat( to[1] - to[0] );
		var op;
		if (fromsize < 0){
			op = ((value/fromsize) * tosize) - to[0];
		}
		else {
			op = ((value/fromsize) * tosize) + to[0];
		}
		return parseFloat(op);
	}
	
	// copy object method
	this.copy = function(obj){
		return JSON.parse(JSON.stringify(obj));
	}

	// clip method
	this.clip = function(val, min, max){
		if (this.isNumber(val) && this.isNumber(min) && this.isNumber(max)){
			return Math.min(Math.max(val,min),max);
		}
		else {
			post("err: joex.clip received invalid value");
			return 0;
		}
	}
	
	this.areEquals = function(obj1,obj2){
		return JSON.stringify(obj1) == JSON.stringify(obj2);
	}

	// file exists method
	this.fileExists = function(fp){
		var file = new File(fp);
		if(!file.isopen)
		{
		    post("\nFile "+fp+" doesn't exist.");
			file.close();
		    return false;
		}
		else
		{
		    post("\nFile "+fp+" exists.");
			file.close();
		    return true;
		}
	}

	// read file method
	this.readFile = function(fp){
		var file = new File(fp);
		if(this.fileExists(fp)){
			var i=0,line=file.readline(), content=[];
			file.access = "read";
			do{
				content[i] = line;
				i++;
				line=file.readline();
			}while(line != null);
		}
		else {
		}
		file.close();
		return content; // returns content of file as a array of lines fo the file's content
	}

//	this.error = function(x)
//	{
//		var errorString = "• error: " + x.jsarguments[0] + ":";
//
//		// If the it's a string with a lenth of 1 -> it's strange...
//		// that means we passed a string to the function (and the length property refer to a string)
//		if (arguments.length > 2 && typeof(arguments[1]) == "string" && arguments[1].length == 1)
//			errorString += " " + arguments[1];
//		else {
//			for (var i = 1; i < arguments.length; i++)
//				errorString += " " + arguments[i];
//		}
//
//		post(errorString + "\n");
//	}
	
	return this;
}