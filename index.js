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
    let splittedCommand = command.split(" ");
    switch (splittedCommand[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(collectAllTODO());
            break;
        case 'important':
            console.log(collectImportant());
            break;
        case 'user':
            console.log(findUsername(splittedCommand[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function collectAllTODO() {
    let result = [];
    for (let file of files) {
        let lines = file.split('\n');
        for (let line of lines) {
            if (line.includes('// TODO') && !line.includes('\'// TODO')) {
                result.push(line.slice(line.indexOf('/')));
            }
        }
    }
    return result;
}

function collectImportant() {
    let todo = collectAllTODO();
    let result = [];
    todo.forEach((el, i) => {
        if (el.includes("!")) result.push(el);
    })
    return result;
}

function findUsername(name) {
    let todo = collectAllTODO();
    let result = [];
    for (let str of todo) {
        let newStr = str.replace('// TODO ', '').split('; ');
        if (newStr.length == 3) {
            let objTodo = {
            userName: newStr[0].toLowerCase(),
            date: newStr[1],
            comment: newStr[2]
        }
        result.push(objTodo);
        }
    }
    let resComent = '';
    for (el of result) {
        if (el.userName === name) 
        resComent += el.comment + '\n';
    }
    return resComent;
}
// TODO you can do it!
