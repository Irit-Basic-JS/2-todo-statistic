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
    let commands = command.split(" ");

    switch (command) {
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
            switch (commands[1]){
                case 'importance':
                    console.log(sortImp());
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

//2. show : показать все todo
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

//3.  important : показывать только todo, в которых есть восклицательный знак
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

//4. user {username} : показывать только комментарии от указанного пользователя
function showByUser(name){
    return toShow().filter(line => line.toLowerCase().includes(name.toLowerCase()))
}

//5. sort {importance | user | date} : выводит отсортированные todo
//
function sortImp() {
    let allTODO = toShow();
    return allTODO.sort(compareImp);
}

function sortUser() {
    let newAllTODO = toShow().sort().sort(compareUser);
    return newAllTODO;
}

function sortDate() {
    let allTODO = toShow();
    return allTODO.sort(compareDate);
}
// TODO you can do it!
//123\Desktop\Intensive\2-todo-statistic-master\2-todo-statistic-master\index.js
