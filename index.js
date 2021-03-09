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

function readImportant() {
    return readTodos().filter(x => x.endsWith('!'));
}

function getSorted(criterion) {
    switch (criterion) {
        case 'importance':
            return readTodos().sort(sortByImportance);
        case 'user':
            return readTodos().sort(sortByUser);
        case 'date':
            return readTodos().sort(sortByDate);
    }
}

function sortByImportance(second, first) {
    if (first.split('!').length < second.split('!').length)
        return -1;
    else
        return 1;
}

function sortByUser(first, second) {
    users = [first.split('; ')[0].toLowerCase(), second.split('; ')[0].toLowerCase()];
    if (first.split('; ').length === 1)
        return 1;
    else if (second.split('; ').length === 1)
        return -1;
    else {
        if (users[0] < users[1])
            return -1;
        if (users[0] > users[1])
            return 1;
        return 0;
    }
}

function sortByDate(first, second) {
    parsed = [first.split('; '), second.split('; ')];
    if (parsed[0].length === 3) {
        if (parsed[1] === 3)
        {
            if (parsed[0][1] < parsed [1][1])
                return -1;
            else 
                return;
        }
        else 
            return 1;
    }
    else
        return -1;
}

function getByUser(user) {
    return readTodos()
    .filter(x => x.toLowerCase().includes(user))
}

// TODO you can do it!
