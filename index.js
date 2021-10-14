const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
 
const files = getFiles();
const lines = parseLines();

function parseLines() {
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
            break;
        case 'show':
            console.log(showTodo());
             break;
        case 'important':
             console.log(showExclamation());
             break;
        case 'user':
            console.log(showUserNames(words[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function showExclamation() {
    let importantLines = [];
    for (let line of lines)
        if (line.includes("!") && line.includes("// TODO"))
            importantLines.push(line.slice(line.indexOf("// TODO")));
    return importantLines;
}

 
function showUserNames(username) {
    username.toLowerCase();
    let namedLines = [];
    for (let line of lines)
        if (line.toLowerCase().includes(username) && line.includes("// TODO"))
            namedLines.push(line.slice(line.indexOf("// TODO")).split(';')[2].replace(' ', ''));
    return namedLines;
}

function showTodo() {
    let toDoLines = [];
        for (let line of lines)
            if (line.includes("// TODO"))
                toDoLines.push(line.slice(line.indexOf("// TODO")));
    return toDoLines;
}
// TODO you can do it!
