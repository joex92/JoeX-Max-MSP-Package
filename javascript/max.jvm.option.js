autowatch = 1
inlets = 1
outlets = 1

//var filename = "/Applications/Max.app/Contents/Resources/C74/packages/max-mxj/java-classes/max.java.config.txt";
var filename = "max.java.config.txt";

var c = readFile(filename);

overwriteFile("asdf.txt","number \n"+Math.random())
//false
//file = new File("foolio.txt","readwrite");
//file.writeline("New file created here today!");
//true
//file.access = "readwrite";
//file.writeline("Overwriting stuff.");
//file.eof = file.position;

function msg_int(i){
	outlet(0,c[joex.clip(i,0,c.length-1)].replace(/;/gi,""));
}

function overwriteFile(fp,content){
	var file = new File(fp);
	if(fileExists(fp)){
		file.isopen;
		file.access = "readwrite";
		if (Array.isArray(content)){
			post("is array!");
			for (i = 0;i < content.length;i++){
				file.writeline(content[i]);
			}
			file.eof = file.position;
		}
		else{
			post("is string!");
			file.writeline(content);
			file.eof = file.position;
		}
		file.close();
	}
}

function bang(){
	rwlines(filename,"asdf.txt");
}

function anything(){
	args = joex.ArrToi0obji1Num(arrayfromargs(messagename, arguments))[0];
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