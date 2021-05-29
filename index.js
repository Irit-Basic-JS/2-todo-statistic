const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const fileNames = getFileNames();
const todos = getTodos();

console.log('Please, write your command!');
// readLine(processCommand); Idk how to use it
processCommand('show');

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getFileNames() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    let names = [];
    for (let path of filePaths) {
        names.push(getFileFromPath(path));
    }
    return names;
}

function getFileFromPath(path) {
    let pathSplit = path.split("/");
    return pathSplit[pathSplit.length - 1];
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
    let results = [];

    for (let todo of todos){
        if (todo.includes("!")){
            results.push(todo);
        }
    }

    for (let row of getTable(results)){
        console.log(row);
    }
}

function getUserTodos(user){
    let user1 = user.charAt(0).toLowerCase() + user.slice(1);
    let user2 = user.charAt(0).toUpperCase() + user.slice(1);
    let results = [];

    for (let todo of todos){
        if (todo.includes('// TODO ' + user1) 
        || todo.includes('// TODO ' + user2)){
            results.push(todo);
        }
    }

    for (let row of getTable(results)){
        console.log(row);
    }
}

function sortImp(){
    let clone = todos.slice();
    clone.sort((a, b) => compareImp(a, b));
    for (let row of getTable(clone)){
        console.log(row);
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
    for (let row of getTable(clone)){
        console.log(row);
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

    for (let row of getTable(clone)){
        console.log(row);
    }
}

function compareDate(a, b) {
    let aS = getDate(a);
    let bS = getDate(b);
    return bS.localeCompare(aS);
}

function getDate(todo){
    if ((todo.match(new RegExp("-", "g")) || []).length > 1){
        return todo.substring(todo.indexOf('-') - 4, todo.indexOf('-') + 6);
    } else {
        return '0000-00-00';
    }
}

function getAfterDate(date){
    let results = [];

    while (date.length < 10){
        date = date.concat('-00');
    }
    let clone = todos.slice();
    for (let todo of clone){
        if (getDate(todo).localeCompare(date) > 0){
            results.push(todo);
        }
    }

    for (let row of getTable(results)){
        console.log(row);
    }
}

function getTable(tableData) {
    let allTodoData = [];
    let rowLength = [4, 4, 7, 30];

    for (let todo of tableData){
        let todoData = getTodoData(todo);
        allTodoData.push(todoData);
        rowLength[0] = Math.max(rowLength[0], todoData[0].length);
        rowLength[1] = Math.max(rowLength[1], todoData[1].length);
        rowLength[2] = Math.max(rowLength[2], todoData[2].length);
    }

    rowLength[0] = Math.min(rowLength[0], 10);
    rowLength[1] = Math.min(rowLength[1], 10);
    rowLength[2] = Math.min(rowLength[2], 100);
 
    let separ = "  |  ";

    let table = [];
    let title = "!" + separ + cutField("user", rowLength[0]) + separ + cutField("date", rowLength[1]) 
    + separ + cutField("comment", rowLength[2]) + separ + cutField("file name", rowLength[3]);
    let border = '-'.repeat(title.length);
    table.push(title, border);

    for (let todoData of allTodoData){
        let fields = [todoData[2].includes('!') ? '!' : ' '];
        fields.push(cutField(todoData[0], rowLength[0]));
        fields.push(cutField(todoData[1], rowLength[1]));
        fields.push(cutField(todoData[2], rowLength[2]));
        if (todoData[2].length > 0) {
            for (let i = 0; i < files.length; i++){
                let strings = files[i].split("\n");
                for (let str of strings){
                    if (str.includes(todoData[2])){
                        todoData[3] = fileNames[i];
                    }
                }
            }
        }
        fields.push(cutField(todoData[3], rowLength[3]));
        table.push(fields.join(separ));
    }

    table.push(border);
    return table;
}

function cutField (str, len) {
    return str.length > len ? str.slice(0, len-3) + "..." 
    : str + ' '.repeat(len - str.length);
}

function getTodoData(todo){
    let data = ['', '', '', ''];
    
    if (todo.includes(';')){
        data[0] = todo.substring(8, todo.indexOf(';'));
    } else {
        data[2] = todo.substring(8);
        return data;
    }

    if (todo.includes('-')){
        data[1] = todo.substring(todo.indexOf('-') - 4, todo.indexOf('-') + 6);
    } else {
        data[2] = todo.substring(todo.indexOf(';') + 1);
        return data;
    }

    data[2] = todo.substring(todo.indexOf('-') + 8);
    return data;
}

// TODO you can do it!
