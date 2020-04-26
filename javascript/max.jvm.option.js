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

/* TESTING */
//post(joex.overwriteFile("asdf.txt",["Number",Math.random()*100]));
//post(joex.replaceLineInFile("asdf.txt",0,"asdf"));
//var test = [1,2,3,4];
//joex.postarr(test);
//test.splice(0,1,undefined);
//joex.postarr(test);
joex.copyFileToFile(configfile,"test."+configfile+".txt");
updateMaxJVMop("test."+configfile+".txt",defargs);

function updateMaxJVMop(fp,arg){
	var c = joex.readFile(fp);
	var i = findInFile(fp,jvm);
	joex.postarr(c);
	joex.postarr(i);
	for(j=0;j<i.length;j++){
		if (c[i[j][0]].split(" ")[0] == jvm){
			joex.postln(c[i[j[0]]]);
		}
	}
}
replace.local = 1;
/* TESTING */

function msg_int(i){
	outlet(0,[i,max_java_config[joex.clip(i,0,max_java_config.length-1)]/*.replace(/;/gi,"|")*/]);
}

function bang(){
	// updates jvm options on max config file. still to implement.
}

function anything(){
	args = joex.arrayNumDelace(arrayfromargs(messagename, arguments))[0];
	for (i = 0;i < args.length;i++){
		if(args[i].charAt(0) != '-'){
			args.splice(i,1);
			post(args[i]+" incorrect argument, ignoring it.");
		}
	}
}