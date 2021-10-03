const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const {TODOs} = require("./TODOs");
const {TODOsViewer} = require("./TODOsViewer");
const path = require("path");

const currentDirectory = process.cwd();
const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    return getAllFilePathsWithExtension(currentDirectory, 'js');
}

function processCommand(command) {
    const commandArgs = parseCommand(command);
    switch (commandArgs[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        case 'user':
            user(commandArgs[1]);
            break;
        case 'sort':
            sort(commandArgs[1]);
            break;
        case 'date':
            date(commandArgs[1]);
            break;
        default:
            console.log('Wrong command');

    }
}

const todos = getTODOsFromFiles(files);

function parseCommand(command) {
    const args = command.split(' ');
    if (args.length > 2)
        throw 'Wrong command';
    return args;
}

function show() {
    printTODOs(todos.list);
}

function important() {
    const filtered = todos.selectImportant();
    printTODOs(filtered.list);
}

function user(userName) {
    const filtered = todos.selectByUser(userName);
    printTODOs(filtered.list);
}

function sort(type) {
    let filtered;
    switch (type) {
        case 'importance':
            filtered = todos.sortByImportance();
            break;
        case 'user':
            filtered = todos.sortByUser();
            break;
        case 'date':
            filtered = todos.sortByDate();
            break;
        default:
            throw 'Unsupported sort type';
    }

    printTODOs(filtered.list);
}

function date(date) {
    const filtered = todos.selectAfter(date);
    printTODOs(filtered.list);
}


function getTODOsFromFiles(files) {
    const todos = new TODOs();
    for (const file of files)
        todos.list.push(...todos.getAllTODOs(readFile(file), path.relative(currentDirectory, file)).list);
    return todos;
}

function printTODOs(todos) {
    const columnsSize = calculateColumnsSize(todos);
    const viewer = new TODOsViewer(columnsSize);

    logTODOsToConsole(viewer, todos);
}

function calculateColumnsSize(todos) {
    const maxAuthorLen = Math.max(...todos.map(todo => todo.author ? todo.author.length : 0));
    const maxContentLen = Math.max(...todos.map(todo => todo.content.replace(/!/g, "").length));
    const maxFileLen = Math.max(...todos.map(todo => todo.file ? todo.file.length : 0));
    return [1, maxAuthorLen, 10, maxContentLen, maxFileLen];
}

function logTODOsToConsole(viewer, todos) {
    console.log(viewer.createHeader());
    console.log(viewer.createHorizontalLine());
    for (const todo of todos)
        console.log(viewer.createRow(todo));
}

// TODO I made it!
