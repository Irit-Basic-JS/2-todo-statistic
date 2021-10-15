const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path');

const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
const files = filePaths.map(path => readFile(path));

console.log('Please, write your command!');
readLine(processCommand);

function processCommand(command) {
    let commands = command.split(" ");
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
        case 'show':
            printTable(toShow());
            break;
        case 'important':
            printTable(getImportantNotes());
            break;
        case 'user':
            printTable(getUserComments(commands[1]));
            break;
        case 'sort':
            switch (commands[1]) {
                case 'importance':
                    printTable(sortByComparer(compareByImportance));
                    break;
                case 'user':
                    printTable(sortByComparer(compareByUser));
                    break;
                case 'date':
                    printTable(sortByComparer(compareByDate));
                    break;
            }
            break;
        case 'date':
            printTable(getDateNotes(commands[1]));
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
    for (let line of allNotes)
        if (line.split(';')[0].slice(8).toLowerCase() === username.toLowerCase())
            result.push(line);

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

function getDateNotes(strDate) {
    strDate = strDate.split('-').join('');
    numDate = +strDate.padEnd(8, '0');

    sortedByDate = sortByComparer(compareByDate);
    index = sortedByDate.length;

    for (let i = 0; i < sortedByDate.length; i++) {
        let curLineSplited = sortedByDate[i].split(';')

        if (curLineSplited.length < 2
            || +curLineSplited[1].split('-').join('') < numDate) {
            index = i;
            break;
        }
    }

    return sortedByDate.splice(0, index);
}

function printTable(data) {
    let headers = ["!", "user", "date", "comment", "file name"];
    let spacing = [1, 10, 10, 50, 20];
    let newSpacing = [1, 0, 0, 0, 0];

    let formatedData = [];

    let curIndex = 0;
    for (let line of data) {
        formatedData.push([]);
        formatedData[curIndex].push(line.includes('!') ? '!' : ' ');

        let splitedLine = line.split(';');
        formatedData[curIndex].push(splitedLine.length > 1 ? splitedLine[0].slice(8) : ' ');
        formatedData[curIndex].push(splitedLine.length > 1 ? splitedLine[1].trim() : ' ');
        formatedData[curIndex].push(splitedLine.length > 1 ? splitedLine[2].trim() : line.slice(8));

        for (let file of files)
            if (file.includes(line))
                formatedData[curIndex].push(path.basename(filePaths[files.indexOf(file)], '.js'));

        for (let i = 1; i < spacing.length; i++)
            if (formatedData[curIndex][i].length > spacing[i]) {
                formatedData[curIndex][i] = formatedData[curIndex][i].substr(0, spacing[i] - 1) + '…';
                newSpacing[i] = spacing[i];
            }
            else if (formatedData[curIndex][i].length > newSpacing[i])
                newSpacing[i] = formatedData[curIndex][i].length;

        curIndex++;
    }

    spacing = newSpacing;

    let separator = '-'.repeat(spacing
        .toString().split(',')
        .map(el => parseFloat(el))
        .filter(el => !Number.isNaN(el))
        .reduce((acc, cur) => acc + cur) + 20);

    console.log(printSeparatedLine(headers, spacing));
    console.log(separator);

    for (let line of formatedData)
        console.log(printSeparatedLine(line, spacing));

    console.log(separator);
}

function printSeparatedLine(arr, spacing) {
    let index = 0;
    return arr.map(e => e.padEnd(spacing[index++], ' ')).join('  |  ');
}

// TODO you can do it!
