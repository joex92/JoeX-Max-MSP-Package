autowatch = 1
inlets = 1
outlets = 1

//var configfile = "/Applications/Max.app/Contents/Resources/C74/packages/max-mxj/java-classes/max.java.config.txt";
var configfile = "max.java.config.txt";
var jvm = "max.jvm.option"
var defargs = [jvm+" -Xincgc",jvm+" -Xms64m",jvm+" -Xmx256m"];
var args = joex.GetArgs(jsarguments);
var max_java_config = joex.readFile(configfile);
post("\nasdf\tasdf")
post("\nasdf asdf")
post(overwriteFile("asdf.txt",["Number",Math.random()*100]));
post(replaceLineInFile("asdf.txt",0,"asdf"));

function clear(){
	var c = joex.readFile(configfile);
	var i = findInFile(configfile,jvm);
	post(c[17]);
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

function overwriteFile(fp,content){
	var file = new File(fp);
	var written = true;
	if(joex.fileExists(fp)){
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
		post("Could not write content to file.");
	}
	file.close();
	return written;
}

function appendToFile(fp,content){
	if (Array.isArray(content)){
		return overwriteFile(fp,joex.readFile(fp).concat(content));
	}
	else {
		return overwriteFile(fp,joex.readFile(fp).concat([content]));
	}
}

function prependToFile(fp,content){
	if (Array.isArray(content)){
		return overwriteFile(fp,content.concat(joex.readFile(fp)));
	}
	else {
		return overwriteFile(fp,[content].concat(joex.readFile(fp)));
	}
}

function findInFile(fp,find){
	if (!Array.isArray(find)){
		find = [find];
	}
	var content = joex.readFile(fp);
	var k=0,found = [[]];
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

function replaceStrInFile(fp,find,replace){
	if (Array.isArray(find)){
		find = find.join("\n");
	}
	if (Array.isArray(replace)){
		replace = replace.join("\n");
	}
	var content = joex.readFile(fp).join("\n");
	find = new RegExp(find.toString(),"gi");
	return overwriteFile(fp,content.replace(find,replace.toString()));
}

function replaceLineInFile(fp,i,replace){
	if (joex.isNumber(i)){
		if (Array.isArray(replace)){
			replace = replace.join("\n");
		}
		var content = joex.readFile(fp);
		content.splice(i,1,replace.toString());
		return overwriteFile(fp,content);
	}
	else {
		post("Invalid line index value.");
		return false;
	}
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