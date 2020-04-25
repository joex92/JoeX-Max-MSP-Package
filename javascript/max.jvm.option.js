/* NOT FINISHED */
autowatch = 1
inlets = 1
outlets = 1

//var configfile = "/Applications/Max.app/Contents/Resources/C74/packages/max-mxj/java-classes/max.java.config.txt";
var configfile = "max.java.config.txt";
var jvm = "max.jvm.option"
var defargs = [jvm+" -Xincgc",jvm+" -Xms64m",jvm+" -Xmx256m"];
var args = joex.GetArgs(jsarguments);
var max_java_config = joex.readFile(configfile);
//post(joex.overwriteFile("asdf.txt",["Number",Math.random()*100]));
//post(joex.replaceLineInFile("asdf.txt",0,"asdf"));
var test = [1,2,3,4];
joex.postarr(test);
test.splice(0,1,undefined);
joex.postarr(test);


function deleteLinesInFile(fp,lines){
	if (!Array.isArray(fp)){
		fp = fp.toString();
		if (lines == undefined){
			lines = [-1];
		}
		if (arguments.length > 2){
			lines = joex.arrayNumDelace(arguments)[1];
		}
		if (joex.isNumber(lines)){
			if (!Array.isArray(lines)){
				lines = [lines];
			}
			var read = joex.readFile(fp);
			var deleted = 0;
			for (i = 0;i < lines.length;i++){
				if (lines[i] > -1){
					read.splice(lines[i],1);
					deleted++;
				}
				else {
					joex.postln(lines[i]+" value is invalid, ignoring.");
				}
			}
			post(deleted+" line(s) deleted");
			if (deleted > 0){
				return joex.overwriteFile(fp,read);
			}
			else {
				return false;
			}
		}
		else {
			joex.postln("Invalid line(s) index value.");
			return false;
		}
	}
	else{
		this.postln("Invalid filepath value.");
		return false;
	}
}

function clear(){
	var c = joex.readFile(configfile);
	var i = findInFile(configfile,jvm);
	joex.postarr(c);
	post(i.join("\n"));
	while(c[i[0][0]]!=""){
		c.splice(i[0][0],1);
	}
//	post(c.join("\n"));
	for(j=0;j<defargs.length;j++){
		c.splice(i[0][0]+j,0,defargs[j])
	}
//	post(c.join("\n"));
}

function msg_int(i){
	outlet(0,max_java_config[joex.clip(i,0,max_java_config.length-1)].replace(/;/gi,"|"));
}

function bang(){
	rwlines(configfile,"asdf.txt");
}

function anything(){
	args = joex.arrayNumDelace(arrayfromargs(messagename, arguments))[0];
	for (i = 0;i < args.length;i++){
		if(args[i].charAt(0) == '-'){
			post("correct argument");
		}
		else{
			args.splice(i,1);
			post("incorrect argument");
		}
	}
}