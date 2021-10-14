const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
//const { fstat } = require('fs');

const files = getFiles();
const comments = getAllComments();
console.log('Please, write your command!');
readLine(processCommand);


function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    //const commandParameters = command.split(' ');
    //let comms = [];
    switch (command) {
        case 'exit':
            process.exit(0);
        case 'show':
            console.log(comments);
            break;
        case 'important':
            console.log(comments.filter(x => x.important));
            break;
        case 'user':
            console.log(comments.filter(x => x.user));
        default:
            console.log('wrong command');
            break;
    }
}

function getAllComments() {
    let lines = [];
    for (let file of files)
        lines.push(...file.split('\r\n'));
    lines = lines.flat(Infinity);
    const matches = [];
    for (let line of lines) {
        let search = line.indexOf(`// TODO`);
        if (search != -1)
            matches.push(line.substring(search));
    }
    return matches;   
}


// TODO you can do it!
