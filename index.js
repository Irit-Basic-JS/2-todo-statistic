const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
 
const files = getFiles();
const lines = parseLl();

function parseLl() {
    let parsedFiles = [];
    let lines = [];
    for (let i = 0; i < files.length; i++) {
        parsedFiles.push(files[i].split("\r\n"));
        lines = lines.concat(parsedFiles[i]);
    }
    return lines;
}
 
console.log('Please, write your command!');
readLine(processCommand);
 
function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
 
function processCommand(command) {
    let commands = command.split(" ");
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
        case 'show':
            console.log(showTodo());
             break;
        case 'important':
             console.log(showExclamation());
             break;
        case 'user':
            console.log(showUserNames(commands[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function showExclamation() {
    let importantLl = [];
    for (let l of lines)
        if (l.includes("!") && l.includes("// TODO") && !(l.includes("\"// TODO\"")))
            importantLl.push(l.slice(l.indexOf("// TODO")));
    return importantLl;
}

 
function showUserNames(name) {
    name = name.toLowerCase();
    let namedLl = [];
    for (let l of lines)
        if (l.toLowerCase().includes(name) && l.includes("// TODO") && !(l.includes("\"// TODO\"")))
            namedLl.push(l.slice(l.indexOf("// TODO")).split(';')[2].replace(' ', ''));
    return namedLl;
}

function showTodo() {
    let todoLl = [];
        for (let l of lines)
            if (l.includes("// TODO") && !(l.includes("\"// TODO\"")))
                todoLl.push(l.slice(l.indexOf("// TODO")));
    return todoLl;
}
// TODO you can do it!
