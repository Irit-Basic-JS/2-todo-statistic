"use strict";

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
            console.log(showTODO());
            break;
        case 'important':
            console.log(showImportantTODO());
            break;
        case 'user':
            console.log(showTODOFrom(commands[1]));
            break;
        // case 'sort':
        //     console.log(showSortTODOBy(commands[1]));
        //     break;
        default:
            console.log('wrong command');
            break;
    }
}

function showImportantTODO() {
    let lines = showTODO();
    const matches = [];
    for (let line of lines) {
        let search = line.indexOf(`!`);
        if (search != -1) {
            matches.push(line);
        }
    }
    return matches;
}
 
function showTODO() {
    let lines = [];
    for (let file of files)
        lines.push(...file.split('\r\n'));
    lines = lines.flat(Infinity);
    const matches = [];
    for (let line of lines) {
        let search = line.indexOf(`// TODO`);
        if (search != -1) {
            matches.push(line.substring(search));
        }
    }
    return matches;
}

function showTODOFrom(name) {
    let lines = showTODO();
    name = name.toLowerCase();
    const matches = [];
    for (let line of lines) {
        let lineStore = line.toLowerCase();
        let lineName = lineStore.slice(0, lineStore.indexOf(`;`) + 1);
        let search = lineName.indexOf(`${name.toLowerCase()}`);
        if (search != -1 && lineStore[lineStore.indexOf(`${name.toLowerCase()}`) - 1] === ' ') {
            matches.push(line);
        }
    }
    return matches;
}

// function showSortTODOBy(sortProperty) {
//     switch (sortProperty) {
//         case 'important':
//             return showSortTODOBySortProperty();
//         case 'user':
//             return showSortTODOBySortProperty();
//         case 'user':
//             return showSortTODOBySortProperty();
//     }
// }

// function showSortTODOBySortProperty(sortProperty) {

// }

 