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
    let splitedCommand = command.split(' ')
    switch (splitedCommand[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(toShow());
            break;
        case 'important':
            console.log(showImportant());
            break;
        case 'user':
            console.log(showByUser(splitedCommand[1]));
            break;
        case 'sort':
            switch (splitedCommand[1]){
                case 'importance':
                    console.log(sortImportance());
                    break;
                case 'user':
                    console.log(sortUser());
                    break;
                case 'date':
                    console.log(sortDate());
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() {
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

function showImportant() {
    let allTasks = toShow();
    let importantTasks = []
    for (let task of allTasks){
        if (task.includes('!')){
            importantTasks.push(task);
        }
    }
    return importantTasks;
}

function showByUser(name){
    return toShow().filter(line => line.toLowerCase().includes(name.toLowerCase()))
}

function sortImportance(){
    return toShow().sort((line1, line2) => line2.split('!').length - line1.split('!').length);
}

function sortUser(){
    return toShow().sort((task1, task2) => {
        let name1 = task1.toLowerCase()
        let name2 = task2.toLowerCase()
        if (task1.split(';').length != 1){
            if (name1 < name2)
                return -1
            if (name1 > name2)
                return 1
            return 0;
        }
        else if (task2.split(';').length === 1)
            return -1
        else
            return 0
    });
}

function sortDate(){
    return toShow().sort(function(task1, task2) {
        task1 = task1.split(';');
        task2 = task2.split(';');
        if (task1.length >= 3 && task2.length >= 3){
            task1 = task1[1].split(' ').join('').split('-').join('');
            task2 = task2[1].split(' ').join('').split('-').join('');
            return task2 - task1;
        }
    });
}
// TODO you can do it!
