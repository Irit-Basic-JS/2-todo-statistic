const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { fileURLToPath } = require('url');

const files = getFiles();

const table = [];
const firstColWidth = 1;
const secondColWidth = 10;
const thirdColWidth = 10;
const fourthColWidth = 50;

let maxUserColWidth = 0;
let maxComColWidth = 0;
const todoMark = `// TODO `;

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
            console.log(printTable(toShow()));
            break;
        case 'important':
            console.log(printTable(toImportant()));
            break;
        case 'user':
            console.log(printTable(toUsername(commands)));
            break;
        case 'sort':
            console.log(printTable(toSort(commands)));
            break;
        case 'date':
            console.log(printTable(toDate(commands)));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() {
    let lines = [];
    for (let file of files)
        lines.push(...file.split('\n'));
    lines = lines.flat(Infinity);
    const matches = [];
    for (let line of lines) {
        let search = line.indexOf(todoMark);
        if (search != -1)        
            matches.push(line.substring(search));
    }

    return matches;
}

function toImportant(){
    let todoLines = toShow();
    let result = [];
    for (let todo of todoLines){
        if (todo.includes('!'))
            result.push(todo);
    }

    return result;
}

function toUsername(commands){
    if (commands.length === 1)
        return "Не задано имя пользователя";
    let username = commands[1];
    let todoLines = toShow();
    let result = [];
    for (let todo of todoLines){
        if (getSeparatedTodo(todo)[0].toLowerCase() === username.toLowerCase())
            result.push(todo);
    }

    return result
}

function toSort(commands){
    if (commands.length === 1)
        return "Не задан критерий сортировки";
    let sortingCriteria = commands[1];
    let todoLines = toShow();

    if (sortingCriteria === 'importance')
        return getSortedByImportance();

    else if (sortingCriteria === 'user')
        return getSortedByUsername();
    
    else 
        return "Неверно задан критерий сортировки";

    function getSortedByImportance(){
        let todoWithExclamation = []
        let otherTodo = [];
        for (let todo of todoLines){
            if (todo.includes('!'))
                todoWithExclamation.push(todo);
            else
             otherTodo.push(todo);
        }

        return todoWithExclamation.sort((a, b) => (b.split('!').length - 1) - (a.split('!').length - 1)).concat(otherTodo);
    }

    function getSortedByUsername(){
        let withUsername = [];
        let withoutUsername = [];
        for (let todo of todoLines){
            let separatedTodo = getSeparatedTodo(todo);
            if (separatedTodo.length === 3)
                withUsername.push(todo);
            else
                withoutUsername.push(todo);
        }

        return withUsername.concat(withoutUsername);
    }
}

function toDate(commands){
    if (commands.length === 1)
        return "Не задана дата";
    let date = commands[1].split('-');
    switch (date.length){
        case 1:
            date = new Date(date[0]);
            break;
        case 2:
            date = new date(date[0], date[1]); 
            break;
        case 3:
            date = new Date(date[0], date[1], date[2]); 
            break;
    }
    let todoLines = toShow();
    let result = [];
    for (let todo of todoLines){
        let separatedTodo = getSeparatedTodo(todo);
        if (separatedTodo.length < 2) continue;

        let todoDate = separatedTodo[1].split('-');
        todoDate = new Date(todoDate[0], todoDate[1], todoDate[2]);
        if (todoDate >= date)
            result.push(todo);
    }

    return result;
}

function printTable(todoList){
    
}

function getSeparatedTodo(todo){
    let separatedTodo = todo.split(';');
    separatedTodo[0] = separatedTodo[0].replace(todoMark, '');
    return separatedTodo;
}

function printTable(comments) {
    for (let comment of comments) {
        const row = [];
        if (comment.indexOf('!') !== -1) row.push('!');
        else row.push(' ');
        const firstIndex = comment.indexOf(';');
        const lastIndex = comment.lastIndexOf(';');
        if (firstIndex !== -1) {
            const user = comment.substring(0, firstIndex).split(' ').slice(2).join(' ');
            if (user.length > secondColWidth) {
                row.push(user.substr(0, secondColWidth - 3).padEnd(secondColWidth, '.'));
                maxUserColWidth = secondColWidth;
            } else {
                if (user.length > maxUserColWidth) maxUserColWidth = user.length;
                row.push(user.padEnd(secondColWidth));
            }
            row.push(comment.substring(firstIndex + 1, lastIndex).trimStart());
        } else row.push(''.padEnd(secondColWidth), ''.padEnd(thirdColWidth));
        const textComment = firstIndex !== -1 
            ? comment.slice(lastIndex + 1).trimStart() 
            : comment.split(' ').slice(2).join(' ');
        if (textComment.length > fourthColWidth) {
            row.push(textComment.substr(0, fourthColWidth - 3).padEnd(fourthColWidth, '.'));
            maxComColWidth = fourthColWidth;
        } else {
            if (textComment.length > maxComColWidth) maxComColWidth = textComment.length;
            row.push(textComment.padEnd(fourthColWidth));
        }
        table.push(row);
    }
    setWidthColumns();
    console.log(table.map(com => com.join('  |  ')).join('\n'));
}

function setWidthColumns() {
    if (maxComColWidth < secondColWidth || maxUserColWidth < fourthColWidth)
        for (let row of table) {
            if (row[1].length > maxUserColWidth) 
                row[1] = row[1].trimEnd().padEnd(maxUserColWidth);
            if (row[3].length > maxComColWidth)
                row[3] = row[3].trimEnd().padEnd(maxComColWidth);
        }
}
// TODO you can do it!