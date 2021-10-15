const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getTodos();

console.log('Please, write your command!');
readLine(processCommand);
processCommand('sort user');

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
            for (let todo of todos){
                console.log(todo);
            }
            break;
        case 'important':
            getImportant();
            break;
        case 'user':
            getUserTodos(commands[1]);
            break;
        case 'date':
            getAfterDate(commands[1]);
            break;
        case 'sort':
            switch (commands[1]){
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

function getImportant(){
    for (let todo of todos){
        if (todo.includes("!")){
            console.log(todo);
        }
    }
}

function getUserTodos(user){
    let user1 = user.charAt(0).toLowerCase() + user.slice(1);
    let user2 = user.charAt(0).toUpperCase() + user.slice(1);
    for (let todo of todos){
        if (todo.includes('// TODO ' + user1) 
        || todo.includes('// TODO ' + user2)){
            console.log(todo);
        }
    }
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

// TODO you can do it!
