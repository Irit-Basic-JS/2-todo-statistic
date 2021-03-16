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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(collectTODO());
            break;
        case 'important':
            console.log(collectImportantTODO());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function collectTODO() {
    let result = [];
    for (let file of files) {
        let lines = file.split('\r\n');
        for (let line of lines){
            if (line.includes('// TODO ') && !line.includes('\'// TODO'))
            result.push(line.split('// TODO ')[1]);
        }
    }
    return result;
}

function collectImportantTODO() {
    let todo = collectTODO();
    let result = [];
    for (let i = 0; i < todo.length; i++){
        if (todo[i].includes('!')) {
            result.push(todo[i]);
        }
    };
    return result;
}

// TODO you can do it!