const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path')

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
            console.log(putInTable(toShow()));
            break;
        case 'important':
            console.log(putInTable(getImportantTodo()));
            break;
        case `user`:
            //getTodoByName(username)
            console.log(putInTable(getTodoByName(commands[1])));
            break;
        case 'sort':
            console.log(putInTable(sortTodo(commands[1])));
            break;
        case 'date':
            console.log(putInTable(getCommentsAfterDate(commands[1])));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() {
    let lines = [];
    for (let file of files) {
        lines.push(...file.split('\r\n'));
    }
    lines = lines.flat(Infinity);
    //const pattern = /\/\/ TODO/gm;
    const matches = [];
    for (let line of lines) {
        let search = line.indexOf(`// TODO`);
        if (search != -1)
        {
            matches.push(line.substring(search));
        }
        
    }
    //console.log(lines);
    return matches;
}

function getImportantTodo() {
    let todoArray = toShow();
    let result = [];
    for (let todo of todoArray) {
        if (todo.includes('!'))
            result.push(todo);
    }

    return result;
}

function getTodoByName(username) {
    let todoArray = toShow();
    result = [];
    for (let todo of todoArray) {
        let arr = todo.split(';');
        let name = arr[0].slice(8).toLowerCase();
        let comment = arr[2]
        if (name === username.toLowerCase())
            result.push(comment);
    }

    return result;
}

function sortTodo(arg) {
    let result = [];
    if (arg == 'importance') {
        for (i of getImportantTodo())
            result.push(i);
        for (i of toShow()) {
            if (! getImportantTodo().includes(i)) {
                result.push(i);
            }
        }

        return result;
    }

    if (arg == 'user') {
        let result = toShow();
        return result.sort(function(a, b) {
            let user1 = a.toLowerCase().split(';');
            let user2 = b.toLowerCase().split(';');
            if (user1.length != 1) {
                if (user1 > user2)
                    return 1;
                if (user1 < user2)
                    return -1;
                return 0;
            } else if (user2.length === 1) {
                return -1;
            }
            return 0;
        });
    }

    if (arg == 'date') {
        return toShow().sort( (a,b) => {
            let data1 = a.split('; ');
            let data2 = b.split('; ');
            if (data1.length == 3) {
                if (data1[1] > data2[1])
                    return -1;
                if (data1[1] < data2[1])
                    return 1;
                return 0;
            }  
            return 1;
        })
    }
}

function getCommentsAfterDate(date) {
    //date = date.split('-');
    let result = [];
    let todoArray = toShow();
    for (let todo of todoArray) {
        let todoDate = todo.split('; ')[1];
        if (date < todoDate && todoDate !== undefined) {
            result.push(todo)
        }
    }

    return result;
}

function putInTable(todoArray) {
    let isImportant = ['  !  '];
    let users = ['user'];
    let dates = ['date'];
    let comments = ['comment'];
    for (let todo of todoArray) {
        let arr = todo.split('; ');
        if (arr.length < 3)
            continue;

        if (todo.includes('!')) {
            isImportant.push('  !  ');
        } else {
            isImportant.push('     ')
        }

        let name = arr[0].slice(8);
        if (name.length > 10)
            name = name.slice(0, 7) + '...';
        users.push(name);
        dates.push(arr[1]);

        let comment = arr[2];
        if (comment.length > 50)
            comment = comment.slice(0, 47) + '...';
        comments.push(comment);
    }
    let nameMaxLen = getMaxLenItem(users);
    let dateMaxLen = getMaxLenItem(dates);
    let commentMaxLen = getMaxLenItem(comments);

    for (i = 0; i < users.length; i++) {
        if (i == 1) {
            console.log('-'.repeat(5 + nameMaxLen + dateMaxLen + commentMaxLen + 15));
        }
        console.log( isImportant[i] + '|  ' + users[i].padEnd(nameMaxLen + 2) + '|  ' + dates[i].padEnd(dateMaxLen + 2) + '|  ' + comments[i].padEnd(commentMaxLen + 2) );
    }
    console.log('-'.repeat(5 + nameMaxLen + dateMaxLen + commentMaxLen + 15));
}

function getMaxLenItem(arr) {
    let max = 0;
    for (i = 0; i < arr.length; i++) {
        if (arr[i].length > max)
            max = arr[i].length;
    }

    return max;
}

// TODO you can do it!