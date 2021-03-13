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
    let commands = command.split(' '); 
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
        case 'show':
            console.log(readTodos());
            break;
        case 'important':
            console.log(readImportant());
            break;
        case 'user':
            console.log(getByUser(commands[1]));
            break;
        case 'sort':
            console.log(getSorted(commands[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function readTodos() {
    return files
    .map(y => y.split('\r\n'))
    .flat(Infinity)
    .filter(x => x.includes('// TODO ') && !x.includes('\'// TODO'))
    .map(s => s.split('// TODO ')[1]);
}

function Todo(comment, isFull, user = '', date = '') {
    this.user = user;
    this.date = date;
    this.comment = comment;
    this.isFull = isFull;
}

function parseTodos() {
    let todos = [];
    for (let todo of readTodos()) {
        let parsed = todo.split('; ');
        if (parsed.length == 1)
            todos.push(new Todo(parsed[0], parsed.length == 3));
        else
            todos.push(new Todo(parsed[2], parsed.length == 3, parsed[0], parsed[1]))
    }
    return todos;
}

function readImportant() {
    return readTodos().filter(x => x.endsWith('!'));
}

function getSorted(criterion) {
    switch (criterion) {
        case 'importance':
            return readTodos().sort(sortByImportance);
        case 'user':
            return parseTodos().sort(sortByUser);
        case 'date':
            return parseTodos().sort(sortByDate);
    }
}

function sortByImportance(first, second) {
    if (second.split('!').length < first.split('!').length)
        return -1;
    else
        return 1;
}

function sortByUser(first, second) {
    if(!first.isFull)
        return 1;
    return first.user.toLowerCase() < second.user.toLowerCase() ? -1 : 1;
}

function sortByDate(first, second) {
    if(!first.isFull)
        return 1;
    return first.date > second.date ? -1 : 1;
}

function getByUser(user) {
    return readTodos()
    .filter(x => x.toLowerCase().includes(user))
}

// TODO you can do it!
