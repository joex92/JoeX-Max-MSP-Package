var joex = new joexUtils();
joex.postln("JoeX js externals v1.6(2020/04)");

function joexUtils(){

	this.debug = false;
	
	// method to set parameter's function by variable name
	this.parameterfy = (function () {
	    var pattern = /function[^(]*\(([^)]*)\)/;

	    return function (func) {
	        // fails horribly for parameterless functions ;)
	        var args = func.toString().match(pattern)[1].split(/,\s*/);
	        /*debug*/if(this.debug){this.postarr(args)};/*debug*/
	        return function() {
	            var named_params = arguments[arguments.length - 1];
	            if (typeof named_params === 'object') {
	                var params = [].slice.call(arguments, 0, -1);
	                if (params.length < args.length) {
	                    for (var i = params.length, l = args.length; i < l; i++) {
	                        params.push(named_params[args[i]]);
	                    }
	                    return func.apply(this, params);
	                }
	            }
	            return func.apply(null, arguments);
	        };
	    };
	}());
	
	// post to max console with a space prepended method
	this.post = function (val){
		post(" "+val);
	}
	
	// post to max console with a line method
	this.postln = function (val){
		post(" "+val+"\n");
	}
	
	// post an array to max console method
	this.postarr = function (arr,str){
		/*debug*/if(this.debug){this.postln("joex.postarr debug:");this.postln(" arr: "+arr.join(" "));this.postln(" str: "+str);};/*debug*/
		if(Array.isArray(arr)){
			if(str == undefined){
				str = "\n";
			}
			for (i = 0;i < arr.length;i++){
				if (!Array.isArray(str)){
					this.post(i+":["+arr[i]+"]"+str);
				}
				else {
					this.post(i+":["+arr[i]+"]\n")
				}
			}
		}
		else{
			if (arr != undefined){
				this.postln(arr.toString());
			}
		}
	}
	
	// check if value is a number method
	this.isNumber = function (v){
		/*debug*/if(this.debug){this.postln("joex.isNumber debug:")};/*debug*/
		var isNum = true;
		if (!Array.isArray(v)){
			isNum = (Number(v) < 0) || (Number(v) == 0) || (Number(v) > 0);
			/*debug*/if(this.debug){this.postarr([v,isNum])};/*debug*/
		}
		else {
			for (i = 0;i < v.length;i++){
				isNum = isNum && (Number(v) < 0) || (Number(v) == 0) || (Number(v) > 0);
			}
			/*debug*/if(this.debug){this.postarr(v);this.postarr([isNum])};/*debug*/
		}
		return isNum;
	}
	
	// convert a 1 dimensional array to a 2 dimensional array of non-numbers and numbers method
	this.arrayNumDelace = function (arr){
		/*debug*/if(this.debug){this.postln("joex.arrayNumDelace debug:")};/*debug*/
	    var marr = [[],[]];
		if (Array.isArray(arr)){
			/*debug*/if(this.debug){this.postarr(arr)};/*debug*/
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
		/*debug*/if(this.debug){this.postarr(marr[0]);this.postarr(marr[1]);};/*debug*/
		return marr;
	}
	
	// get arguments from jsarguments to a 2 dimensional array method
	this.GetArgs = function (jsargs){
		/*debug*/if(this.debug){this.postln("joex.GetArgs debug:\njsargs:");this.postarr(jsargs)};/*debug*/
		jsargs.splice(0,1);
		/*debug*/if(this.debug){this.postln("jsargs spliced:");this.postarr(jsargs)};/*debug*/
		return this.arrayNumDelace(jsargs);
	}
	
	// linear scale method
	this.lscale = this.parameterfy(function (value, from, to) {
		/*debug*/if(this.debug){this.postarr(["joex.lscale debug:",this.isNumber(value),this.isNumber(from),this.isNumber(to)])};/*debug*/
		if(this.isNumber(value) && this.isNumber(from) && this.isNumber(to)){
			var fromsize = parseFloat( from[1] - from[0] );
			var tosize = parseFloat( to[1] - to[0] );
			var op;
			if (fromsize < 0){
				op = ((value/fromsize) * tosize) - to[0];
			}
			else {
				op = ((value/fromsize) * tosize) + to[0];
			}
			/*debug*/if(this.debug){this.postarr([value,from,to,op])};/*debug*/
			return parseFloat(op);
		}
		else {
			this.postln("Wrong parameter(s) given to joex.lscale");
			return value;
		}
	});

	// clip method
	this.clip = this.parameterfy(function (value, min, max){
		/*debug*/if(this.debug){this.postarr(["joex.clip debug:",this.isNumber(value),this.isNumber(min),this.isNumber(max)])};/*debug*/
		if (this.isNumber(value) && this.isNumber(min) && this.isNumber(max)){
			/*debug*/if(this.debug){this.postarr([value,min,max])};/*debug*/
			return Math.min(Math.max(value,min),max);
		}
		else {
			this.postln("Wrong parameter(s) given to joex.clip.");
			return value;t
		}
	});
	
	// deep copy object method
	this.copy = function (obj){
		return JSON.parse(JSON.stringify(obj));
	}
	
	// check if 2 objects are exactly the same method
	this.areEquals = function (obj1,obj2){
		return JSON.stringify(obj1) == JSON.stringify(obj2);
	}

	// file exists method
	this.fileExists = function (fp){
		/*debug*/if(this.debug){this.postln("joex.fileExists debug:");this.postln(" "+fp);};/*debug*/
		if (!Array.isArray(fp)){
			fp = fp.toString();
			var file = new File(fp);
			if(!file.isopen)
			{
			    this.postln("File "+fp+" doesn't exist.");
				file.close();
			    return false;
			}
			else
			{
			    this.postln("File "+fp+" found.");
				file.close();
			    return true;
			}
		}
		else{
			this.postln("Invalid filepath value.");
			return false;
		}
	}
	
	// create file method
	this.createFile = function (fp){
		/*debug*/if(this.debug){this.postln("joex.createFile debug:");this.postln(" "+fp);};/*debug*/
		try {
			if(!joex.fileExists(fp)){
				file = new File(fp,"readwrite");
				file.eof=0;
				file.close;
			}
			else {
				return false;
			}
		}
		catch (err){
			this.postln(err.message);
			return false;
		}
		finally {
			return true;
		}
	}

	// read file method
	this.readFile = function (fp){
		var content = [];
		if (!Array.isArray(fp)){
			fp = fp.toString();
			var file = new File(fp);
			if(this.fileExists(fp)){
				var i=0,line=file.readline(), content=[];
//				file.type = "TEXT";
				file.access = "read";
				do{
					content[i] = line;
					i++;
					line=file.readline();
				}while(line != null);
			}
			else {
				return content;
			}
			file.close();
			return content; // returns content of file as a string array of file's content's lines
		}
		else{
			this.postln("Invalid filepath value.");
			return content;
		}
	}
	
	// write to a file's content line method
	this.writeFile = function (fp,i,content){
		if (!Array.isArray(fp)){
			fp = fp.toString();
			if (this.isNumber(i)){
				if (!Array.isArray(content)){
					content = content.split("\n");
				}
				var read = this.readFile(fp);
				for (c=0;c<content.length;c++){
					if (read.length <= i){
						for (e=read.length;e<i;e++){
							read[e]="";
						}
						read[i+c] = content[c];
					}
					else{
						read.splice(i+c,0,content[c]);
					}
				}
			}
			else {
				this.postln("Invalid line index value.");
				return false;
			}
		}
		else{
			this.postln("Invalid filepath value.");
			return false;
		}
	}
	
	// overwrite a file's content method
	this.overwriteFile = function (fp,content){
		if (!Array.isArray(fp)){
			fp = fp.toString();
			var file = new File(fp);
			var written = true;
			if(this.fileExists(fp)){
				file.access = "readwrite";
				file.open(fp);
				if (Array.isArray(content)){
					for (i = 0;i < content.length;i++){
						written = written && file.writeline(content[i].toString());
					}
					file.eof = file.position; 
				}
				else{
					written = file.writeline(content);
					file.eof = file.position;
				}
				
			}
			else {
				written = false;
			}
			if (!written){
				this.postln("Could not write content to file.");
			}
			file.close();
			return written;
		}
		else{
			this.postln("Invalid filepath value.");
			return false;
		}
	}
	
	// copy content from a file to another file method
	this.copyFileToFile = function (fpsource,fpdest){
		if (!Array.isArray(fpsource) && !Array.isArray(fpdest)){
			fpsource = fpsource.toString();
			fpdest = fpdest.toString();
			var source = this.readFile(fpsource);
			return this.overwrite(fpdest,source);
		}
		else{
			this.postln("Invalid filepath value.");
			return false;
		}
	}

	// add content at the end of the file method
	this.appendToFile = function (fp,content){
		if (!Array.isArray(fp)){
			fp = fp.toString();
			if (Array.isArray(content)){
				return this.overwriteFile(fp,this.readFile(fp).concat(content));
			}
			else {
				return this.overwriteFile(fp,this.readFile(fp).concat([content]));
			}
		}
		else{
			this.postln("Invalid filepath value.");
			return false;
		}
	}

	// add content at the beginning of the file method
	this.prependToFile = function (fp,content){
		if (!Array.isArray(fp)){
			fp = fp.toString();
			if (Array.isArray(content)){
				return this.overwriteFile(fp,content.concat(this.readFile(fp)));
			}
			else {
				return this.overwriteFile(fp,[content].concat(this.readFile(fp)));
			}
		}
		else{
			this.postln("Invalid filepath value.");
			return false;
		}
	}

	// find all instances of a string or an array of strings in a file method
	this.findInFile = function (fp,find){
		var found = [[]];
		if (!Array.isArray(fp)){
			fp = fp.toString();
			if (!Array.isArray(find)){
				find = [find];
			}
			var k=0,content = this.readFile(fp);
			for (i=0;i<content.length;i++){
				for (j=0;j<find.length;j++){
					if(find[j].split("\n").length == 1){
						if (content[i].search(find[j].toString()) != -1){
							found[k] = [i,content[i].search(find[j].toString()),find[j]];
							k++;
						}
					}
					else {
						var temp="";	
						while(i < (content.length - find[j].split("\n").length + 1)){
							for (l=0;l<find[j].split("\n").length;l++){
								temp = temp + content[i+l] + "\n"
							}
							if (temp.search(find[j].toString()) != -1){
								found[k] = [i,temp.search(find[j].toString()),find[j]];
								k++;
							}
							
						}
					}
				}
			}
			return found;
		}
		else{
			this.postln("Invalid filepath value.");
			return found;
		}
	}

	// find and replace all instances of a string method
	this.replaceStrInFile = function (fp,find,replace){
		if (!Array.isArray(fp)){
			fp = fp.toString();
			if (Array.isArray(find)){
				find = find.join("\n");
			}
			if (Array.isArray(replace)){
				replace = replace.join("\n");
			}
			var content = this.readFile(fp).join("\n");
			return this.overwriteFile(fp,content.replace(new RegExp(find.toString(),"gi"),replace.toString()));
		}
		else{
			this.postln("Invalid filepath value.");
			return false;
		}
	}

	// replace a whole line in a file method
	this.replaceLineInFile = function (fp,i,replace){
		if (i = undefined){
			i = -1;
		}
		if (!Array.isArray(fp)){
			fp = fp.toString();
			if (this.isNumber(i)){
				if (Array.isArray(replace)){
					replace = replace.join("\n");
				}
				var inBounds;
				var content = this.readFile(fp);
				if (i > -1 && i < content.length){
					inBounds = true;
				}
				else {
					inBounds = false;
				}
				if(inBounds){
					var content = this.readFile(fp);
					if (replace == undefined || replace == null){
						content.splice(i,1);
					}
					else {
						content.splice(i,1,replace.toString());
					}
					return this.overwriteFile(fp,content);
				}
				else {
					this.postln("Line index value out of bounds.");
					return false;
				}
			}
			else {
				this.postln("Invalid line index value.");
				return false;
			}
		}
		else{
			this.postln("Invalid filepath value.");
			return false;
		}
	}
	
	// method to handle errors. still figuring it out.
	this.err = function(){}
	
	return this;
}