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
    let commands = command.split(' ');
    switch (commands[0]) {
        case 'show':
            console.log(toShow());
            break;
        case 'important':
            console.log(toImportant());
            break;
        case 'user':
            console.log(toUser(commands[1]));
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() {
    let result = [];
    for (let file of files){
        let strings = file.split("\n");
        for (let str of strings){
            if (str.includes("// TODO ")){
                result.push(str.substring(str.indexOf("// TODO ")));
            }
        }
    }
    return result;
}

function toImportant(){
    let todos = toShow();
    let result = [];
    for (let todo of todos){
        if (todo.includes('!')){
            result.push(todo);
        }
    }
    return result;
}

function toUser(userName) {
    userName = userName.toLowerCase();
    let todos = toShow();
    let result = [];
    for(todo of todos) {
        if(todo.split(';').length === 3 && todo.toLowerCase().startsWith(userName)) {
            result.push(todo);
        }
    }
    return result;
}

// TODO you can do it!
