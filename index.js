const { getAllFilePathsWithExtension, readFile, getFileName } = require('./fileSystem');
const { readLine } = require('./console');

const currentDirectory = process.cwd();
const filesPaths = getFilesPaths();
const todoPattern = new RegExp('// TODO (?:(?<user>[_A-Za-z0-9 ]*); ?)?(?:(?<date>.*); ?)?(?<comment>.*)', 'g');

console.log('Please, write your command!');
readLine(processCommand);

function sum(args) {
    return args.reduce((arg, nextArg) => arg + nextArg);
}

function Todo(username, date, comment, importance, fileName) {
    this.user = username;
    this.date = date;
    this.comment = comment;
    this.importance = importance;
    this.file = fileName;

    this.formatImportance = function () {
        return this.importance ? '!' : ' ';
    }

    this.formatUser = function () {
        return this.user || '';
    }

    this.formatDate = function () {
        return this.date ? this.date.toLocaleDateString('ru').replaceAll('.', '-') : '';
    }
}

function TableTodoFormatter() {
    const columnsMaxSizes = [1, 10, 10, 50];
    const verticalSeparator = '  |  ';
    this.columnsSizes = [];

    this.format = function (todos) {
        this.columnsSizes = this.getColumnsSizes(todos);
        const header = ['!', 'user', 'date', 'comment', 'file'];
        const tableRows = [this.formatProps(header)];
        const tableWidth = sum(this.columnsSizes) + columnsMaxSizes.length * verticalSeparator.length;
        const horizontalLine = '-'.repeat(tableWidth);
        tableRows.push(horizontalLine);
        todos.forEach(todo => {
                const properties = [todo.formatImportance(), todo.formatUser(), todo.formatDate(), todo.comment, todo.file];
                tableRows.push(this.formatProps(properties))
            }
        );
        tableRows.push(horizontalLine);
        return tableRows;
    }

    this.getColumnsSizes = function (todos) {
        return [columnsMaxSizes[0],
            Math.min(Math.max(...todos.map(todo => todo.formatUser().length), columnsMaxSizes[1])),
            columnsMaxSizes[2],
            Math.min(Math.max(...todos.map(todo => todo.comment.length)), columnsMaxSizes[3]),
            Math.max(...todos.map(todo => todo.file ? todo.file.length : 0))];
    }

    this.formatProps = function (properties) {
        const formattedProps = [];
        for (let index = 0; index < properties.length; index++) {
            formattedProps.push(regulateLength(properties[index], this.columnsSizes[index]));
        }
        return `${formattedProps.join(verticalSeparator)}`;
    }

    function regulateLength(str, maxLength) {
        return str.length > maxLength ? truncate(str, maxLength) : str.padEnd(maxLength);
    }

    function truncate(str, maxLength) {
        return str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;
    }
}

function getFilesPaths() {
    return getAllFilePathsWithExtension(currentDirectory, 'js');
}

function createTodo(match, fileName) {
    return new Todo(match.groups.user,
        match.groups.date ? new Date(match.groups.date) : undefined,
        match.groups.comment,
        (match.groups.comment.match(/!/g) || []).length,
        fileName
    );
}

function getAllTodos() {
    const todos = [];
    filesPaths.forEach(filePath => {
        const file = readFile(filePath);
        const matches = [...file.matchAll(todoPattern)];
        const fileName = getFileName(filePath);
        const validTodos = matches.map(match => createTodo(match, fileName)).filter(todo => todo.comment);
        todos.push(...validTodos);
    });
    return todos;
}

function getImportantTodos(todos = getAllTodos()) {
    return todos.filter(todo => todo.importance > 0);
}

function selectByUser(username, todos = getAllTodos()) {
    return todos.filter(todo => userComparer(todo.user, username) === 0);
}

function sortByImportance(todos = getAllTodos()) {
    return sortBy(todos, (todo, nextTodo) => nextTodo.importance - todo.importance);
}

function sortByUser(todos = getAllTodos()) {
    return sortBy(todos, (todo, nextTodo) => userComparer(todo.user, nextTodo.user));
}

function sortByDate(todos = getAllTodos()) {
    return sortBy(todos, (todo, nextTodo) => nextTodo.date - todo.date);
}

function sortBy(todos, comparer) {
    return todos.sort(comparer);
}

function userComparer(username, nextUsername) {
    return username === undefined
        ? 1 : nextUsername === undefined
            ? -1 : username.toLowerCase().localeCompare(nextUsername.toLowerCase());
}

function selectTodosAfter(dateInfo, todos = getAllTodos()) {
    const date = new Date(dateInfo);
    return todos.filter(todo => todo.date && todo.date >= date);
}

function printTodos(todos) {
    const tableFormatter = new TableTodoFormatter();
    tableFormatter.format(todos).forEach(row => console.log(row));
}

function processCommand(command) {
    const [commandName, option] = command.split(' ');

    switch (commandName) {
        case 'show':
            printTodos(getAllTodos());
            break;
        case 'important':
            printTodos(getImportantTodos());
            break;
        case 'user':
            printTodos(selectByUser(option));
            break;
        case 'sort':
            processSortCommand(option);
            break;
        case 'date':
            printTodos(selectTodosAfter(option));
            break
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function processSortCommand(option) {
    switch (option) {
        case 'importance':
            printTodos(sortByImportance());
            break;
        case 'user':
            printTodos(sortByUser());
            break;
        case 'date':
            printTodos(sortByDate());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
