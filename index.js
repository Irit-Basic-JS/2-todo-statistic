const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

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
            console.log(toShow());
            break;
        case 'important':
            console.log(toImportant());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() {
    let lines = [];
    for (let file of files)
        lines.push(...file.split('\n'));
    lines = lines.flat(Infinity);
    const matches = [];
    for (let line of lines) {
        let search = line.indexOf(`// TODO`);
        if (search != -1)        
            matches.push(line.substring(search));
    }
    //console.log(lines);
    return matches;
    //js moment
}

function toImportant(){
    let todoLines = toShow();
    let result = [];
    for (let todo of todoLines){
        if (todo.includes('!'))
            result.push(todo);
    }

    return result;
}
// TODO you can do it!