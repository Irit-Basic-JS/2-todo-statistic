const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let words = command.split(' ')
    switch (words[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(showTODOS());
            break;
        case 'important':
            console.log(showImportant());
            break;
        case 'user':
            console.log(showNames(words[1].toLowerCase()));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function parseLines() {
    let parsedFiles = [];
    let lines = [];
    for (let i = 0; i < files.length; i++) {
        parsedFiles.push(files[i].split("\r\n"));
        lines = lines.concat(parsedFiles[i]);
    }
    return lines;
}

function showNames(username) {
    let namedLines = [];
    let lines = parseLines();
    for (let line of lines)
        if (line.includes("// TODO") && line.toLowerCase().includes(username))
            namedLines.push(line.slice(line.indexOf("// TODO")).split(';')[2].replace(' ', ''));
    return namedLines;
}

function showImportant() {
    let importantLines = [];
    let lines = parseLines();
    for (let line of lines)
        if (line.includes("// TODO") && line.includes("!"))
            importantLines.push(line.slice(line.indexOf("// TODO")));
    return importantLines;
}

function showTODOS() {
    let toDoLines = [];
    let lines = parseLines();
        for (let line of lines)
            if (line.includes("// TODO"))
                toDoLines.push(line.slice(line.indexOf("// TODO")));
    return toDoLines;
}

// TODO you can do it!

