const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

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
        case 'show':
            console.log(toShow());
            break;
        case 'important':
            console.log(getImportantNotes());
            break;
        case 'user':
            console.log(getUserComments(commands[1]));
            break;
        case 'sort':
            switch (commands[1]) {
                case 'importance':
                    console.log(sortByComparer(compareByImportance));
                    break;
                case 'user':
                    console.log(sortByComparer(compareByUser));
                    break;
                case 'date':
                    console.log(sortByComparer(compareByDate));
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() {
    let result = [];
    for (let file of files)
        for (let str of file.split('\r\n'))
            if (str.includes('// TODO') && !str.includes('\'// TODO'))
                result.push(str.slice(str.indexOf('// TODO')));

    return result;
}

function getImportantNotes() {
    return toShow().filter(str => str.includes('!'));
}

function getUserComments(username) {
    let allNotes = toShow();
    let result = [];
    for (let str of allNotes) {
        let arr = str.split(';');
        if (arr[0].slice(8).toLowerCase() === username.toLowerCase())
            result.push(arr[2]);
    }
    return result;
}

function sortByComparer(comparer) {
    return toShow().sort(comparer);
}

function compareByImportance(a, b) {
    return b.split('!').length - a.split('!').length;
}

function compareByUser(a, b) {
    let firstArr = a.split(';');
    let secondArr = b.split(';');
    if (firstArr.length !== 1 && secondArr.length !== 1) {
        let firstName = firstArr[0].slice(8).toLowerCase();
        let secondName = secondArr[0].slice(8).toLowerCase();
        if (firstName > secondName) return 1;
        else if (firstName < secondName) return -1;
        else return 0;
    }
    else if (firstArr.length !== 1 && secondArr.length === 1) return -1;

    else if (firstArr.length === 1 && secondArr.length !== 1) return 1;

    else return 0;
}

function compareByDate(a, b) {
    let firstArr = a.split(';');
    let secondArr = b.split(';');
    if (firstArr.length !== 1 && secondArr.length !== 1) {
        let firstDate = firstArr[1].split('-').join('');
        let secondDate = secondArr[1].split('-').join('');
        if (+firstDate > +secondDate) return -1;
        else if (+firstDate < +secondDate) return 1;
        else return 0;
    }
    else if (firstArr.length !== 1 && secondArr.length === 1) return -1;

    else if (firstArr.length === 1 && secondArr.length !== 1) return 1;

    else return 0;
}

// TODO you can do it!
