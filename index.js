const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getTodos();

console.log('Please, write your command!');
readLine(processCommand);
function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commandArr = command.split(' ');
    switch (commandArr[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTODOfiles());
            break;
        case 'important':
            console.log(getImportant());
            break;
        case 'user':
            console.log(getNamesTODO(commandArr[1]));
            break;
        case 'sort':
            switch (commandArr[1]){
                case 'importance':
                    sortImp();
                    break;
                case 'user':
                    sortUser();
                    break;
                default:
                    sortDate();
                    break;
            }
        default:
            console.log('wrong command');
            break;
    }
}
// TODO you can do it!
function getTODOfiles() {
    let result = [];
    for(let file of files) {
        let strings = file.split('\r\n').filter(x => x.includes('// TODO') && !x.includes('\'// TODO\''));
        for(let string of strings) {
            result.push(string.slice(string.indexOf('//')));
        }
    }
    return removeTODO(result);
}

function getTodos() {
    let todos = [];
    for (let file of files){
        let strings = file.split("\n");
        for (let str of strings){
            if (str.includes("// TODO ")){
                todos.push(str.substring(str.indexOf("// TODO ")));
            }
        }
    }

    return todos;
}

function removeTODO(todos) {
    let result = [];
    for(let todo of todos) {
        todo = todo.substr(8);
        result.push(todo);
    }
    return result;
}

function getImportant(){
    let todos = getTODOfiles();
    let important = [];
    for (let todo of todos){
        if (todo.includes('!')){
            important.push(todo);
        }
    }
    return important;
}

function getNamesTODO(userName) {
    userName = userName.toLowerCase();
    let todos = getTODOfiles();
    let nameTODOS = [];
    for(todo of todos) {
        if(todo.split(';').length === 3 && todo.toLowerCase().startsWith(userName)) {
            nameTODOS.push(todo);
        }
    }
    return nameTODOS;
}

function sortImp(){
    let clone = todos.slice();
    clone.sort((a, b) => compareImp(a, b));
    for (let todo of clone){
        console.log(todo);
    }
}

function compareImp(a, b) {
    let aS = (a.match(new RegExp("!", "g")) || []).length;
    let bS = (b.match(new RegExp("!", "g")) || []).length;
    if (aS <= bS) {
      return 1;
    } else if (aS > bS) {
      return -1;
    }
  }

function sortUser(){
    let clone = todos.slice();
    clone.sort((a, b) => compareUser(a, b));
    for (let todo of clone){
        console.log(todo);
    }
}

function compareUser(a, b) {
    let aS = getUser(a);
    let bS = getUser(b);
    return aS.localeCompare(bS);
}

function getUser(todo){
    if (todo.includes(';')){
        return todo.substring(8, todo.indexOf(';'));
    } else {
        return "ZZZ";
    }
}

function sortDate(){
    let clone = todos.slice();
    clone.sort((a, b) => compareDate(a, b));
    for (let todo of clone){
        console.log(todo);
    }
}

function compareDate(a, b) {
    let aS = getDate(a);
    let bS = getDate(b);
    return aS.localeCompare(bS);
}

function getDate(todo){
    let date = [];
    if ((todo.match(new RegExp("-", "g")) || []).length > 1){
        return todo.substring(todo.indexOf('-') - 4, todo.indexOf('-') + 6);
    } else {
        return '9999-99-99';
    }
}
