const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getTODOfiles();

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
            writeTableToConsole(todos);
            break;
        case 'important':
            writeTableToConsole(getImportant());
            break;
        case 'user':
            writeTableToConsole(getNamesTODO(commandArr[1]));
            break;
        case 'sort':
            switch (commandArr[1]){
                case 'importance':
                    writeTableToConsole(sortImp());
                    break;
                case 'user':
                    writeTableToConsole(sortUser());
                    break;
                case 'date':
                    writeTableToConsole(sortDate())
                    break;
            }
            break;
        case 'date':
            writeTableToConsole(getTodosAfterDate(commandArr[1]))
            break;
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


function removeTODO(todos) {
    let result = [];

    for(let todo of todos) {
        todo = todo.substr(8);
        result.push(todo);
    }

    return result;
}

function getImportant(){
    let list = todos.slice();
    let important = [];

    for (let todo of list){
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
    let result = [];
    let clone = todos.slice();

    clone.sort((a, b) => compareImp(a, b));

    for (let todo of clone){
        result.push(todo);
    }

    return result;
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
    let result = [];
    let clone = todos.slice();

    clone.sort((a, b) => compareUser(a, b));

    for (let todo of clone){
        result.push(todo);
    }

    return result;
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
    let result = [];
    let clone = todos.slice();
    clone.sort((a, b) => compareDate(a, b));

    for (let todo of clone.reverse()){
            result.push(todo);
    }
    
    return result;
}

function compareDate(a, b) {
    let aS = getDate(a);
    let bS = getDate(b);
    
    return aS.localeCompare(bS);
}

function getDate(todo){
    if ((todo.match(new RegExp("-", "g")) || []).length > 1){
        return todo.substring(todo.indexOf('-') - 4, todo.indexOf('-') + 6);
    } else {
        return '0000-00-00';
    }
}

function getTodosAfterDate(date) {
    let result = [];
    let curDate = '';
    date = new Date(Date.parse(date));
    
    for (let todo of todos){
        if ((todo.match(new RegExp("-", "g")) || []).length > 1){
            curDate = new Date(Date.parse(todo.substring(todo.indexOf('-') - 4, todo.indexOf('-') + 6)));
        } else {
            curDate = new Date(Date.parse('9999-99-99'));
        }
        if (curDate > date) {
            result.push(todo);
        } 
    }

    return result;
}

function writeTableToConsole(todos) {
    let head = '  !  |     user     |     date     |  comment  ';
    head = `  !  |     user     |     date     |  ${' '.repeat(21)}comment${' '.repeat(22)}  |     file      `
    let important;
    let user = '';
    let date = '';
    let comment = todo;
    let result = [];

    for(let todo of todos) {
        let fileName;
        const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
        important = todo.includes('!') ? '!': ' ';

        for(let file of filePaths) {
            if(readFile(file).includes(todo)) {
                fileName = file.substring(file.lastIndexOf('/')+1);
            }
        }
        
        if (todo.includes(';')) {
            let column = todo.split(';');
            user = column[0];
            date = column[1].trim();
            comment = column[2].trim();
        } 

        if (user.length >= 10) {
            user = user.substr(0, 7) + '...';
        } 

        if (comment.length >= 50) {
            comment = comment.substr(0, 47) + '...';
        }

        let first =  `  ${important}  `;
        let second = `  ${user.padEnd(10, ' ')}  `;
        let third = `  ${date.padEnd(10, ' ')}  `;
        let fourth = `  ${comment.padEnd(50, ' ')}  `;
        let fifth = `  ${fileName}  `;

        result.push(`${first}|${second}|${third}|${fourth}|${fifth}`);
    }

    console.log(head);
    console.log('-'.repeat(head.length));
    for(let str of result) {
        console.log(str);
    }
}
