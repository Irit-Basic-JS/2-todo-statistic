const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(p => [p.split('/').reverse()[0], readFile(p)]);
}

function processCommand(input) {
    let [command, ...parameters] = input.split(' ');
    switch (command) {
        case 'show':
            tableOutput(searchTODO(files));
            break;
        case 'sort':
            tableOutput(searchTODO(files)
                .sort(todoCompare(parameters[0])));
            break;
        case 'important':
            tableOutput(searchTODO(files)
                .filter(todo => todo.important));
            break;
        case 'user':
            tableOutput(searchTODO(files)
                .filter(todo => todo.user === parameters[0].toLowerCase()));
            break;
        case 'date':
            let date = new Date(Date.parse(parameters[0]));
            tableOutput(searchTODO(files)
                .filter(todo => +todo.date - +date > 0));
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            throw 'Wrong Command!';
    }
}

function searchTODO(files) {
    return files
        .map(file => [file[0], file[1]
            .split('\r\n')
            .filter(line => (/\/\/ TODO /).test(line) && !(/['"`].*\/\/ TODO .*['"`]/).test(line))])
        .reduce((result, file) => result.concat(file[1]
            .map(line => TODO(file[0], line.slice(line.search('// TODO ') + 8)))), []);
}

function TODO(filename, string) {
    let tokens = string.split(';').map(token => token.trim());
    return {
        important: string.includes('!'),
        user: tokens.length === 3 ? tokens[0].toLowerCase() : null,
        date: tokens.length === 3 ? new Date(Date.parse(tokens[1])) : null,
        message: tokens.length === 3 ? tokens[2] : tokens[0],
        filename
    };
}

function todoCompare(parameter) {
    switch (parameter) {
        case 'importance':
            return (a, b) => +b.important - +a.important;
        case 'user':
            return (a, b) => (a.user == null || b.user == null)
                ? +(a.user == null) - +(b.user == null) : a.user.localeCompare(b.user);
        case 'date':
            return (a, b) => (a.date == null || b.date == null)
                ? +(a.date == null) - +(b.date == null) : +b.date - +a.date;
        default:
            throw 'Wrong Command!';
    }
}

function tableOutput(todos) {
    const fields = [['!', 1], ['user', 10], ['date', 10], ['comment', 50], ['filename', 20]];

    let todosTuples = [fields.map(f => f[0])];
    let lengths = todosTuples[0].map(f => f.length);
    for (let todo of todos) {
        todosTuples.push([
            !todo.important ? ' ' : '!',
            todo.user == null ? '' : todo.user,
            todo.date == null ? '' : todo.date.toISOString().substr(0, 10),
            todo.message,
            todo.filename
        ]);
        lengths.forEach((l, i) => lengths[i] = Math.max(l, todosTuples[todosTuples.length - 1][i].length));
    }
    lengths.forEach((l, i) => lengths[i] = Math.min(l, fields[i][1]));

    let line = '-'.repeat(lengths.reduce((sum, l) => l, 0) + 5 * fields.length - 1);
    let todoToString = (todo) => todo.map((f, i) => formatString(f, lengths[i])).join('  |  ');
    console.log(todoToString(todosTuples[0]));
    console.log(line)
    for (let todo of todosTuples.slice(1)) {
        console.log(todoToString(todo));
    }
    console.log(line);
}

function formatString(str, len) {
    return str.length > len ? str.substr(0, len - 3) + '...' : str.padEnd(len, ' ');
}

// TODO Дэвид Блейн ; 2008-06-05 ; я делаю уличную магию, особую
// TODO хотите увидеть немного магии?
// TODO ты демон!