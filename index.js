const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();
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
            console.log(toShow());
            break;
        case 'important':
            console.log(toImportant());
            break;
        case 'user':
            console.log(toUsername(commands));
            break;
        case 'sort':
            console.log(toSort(commands));
            break;
        case 'date':
            console.log(toDate(commands));
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
// TODO you can do it!