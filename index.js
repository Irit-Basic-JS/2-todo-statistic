const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { fileURLToPath } = require('url');

const files = getFiles();

const table = [];
const firstColWidth = 1;
const secondColWidth = 10;
const thirdColWidth = 10;
const fourthColWidth = 50;

let maxUserColWidth = 0;
let maxComColWidth = 0;

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function toShow() {
    const lines = [];
    for (let file of files)
        lines.push(...file.split('\r\n'));
    const comments = [];
    for (let line of lines) {
        const search = line.indexOf(`\/\/ TODO`);
        if (search !== -1)
            comments.push(line.substring(search));
    }
    return comments;
}

function getImportant() {
    const importantComments = [];
    const comments = toShow();
    for (let comment of comments)
        if (comment.indexOf('!') !== -1)
            importantComments.push(comment);
    return importantComments;
}

function getByUser(user) {
    const comments = toShow();
    const commentsByUser = [];
    for (let comment of comments) {
        const search = comment.indexOf(';');
        if (search !== -1)
            if (comment.substring(0, search).split(' ').slice(2).join(' ').toLowerCase().localeCompare(user) === 0)
                commentsByUser.push(comment);
    }
    return commentsByUser;
}

function sortByParameter(parameter) {
    const comments = toShow();
    switch (parameter) {
        case 'importance':
            return comments.sort((com1, com2) => countSubstring(com2, '!') - countSubstring(com1, '!'));
        case 'user':
            const commentsByUser = comments
                                        .filter(com => com.indexOf(';') !== -1)
                                        .sort((com1, com2) => compareByUser(com1, com2));
            commentsByUser.push(...comments.filter(com => com.indexOf(';') === -1));
            return commentsByUser;
        case 'date':
            const commentsByDate = comments
                                        .filter(com => com.indexOf(';') !== -1)
                                        .sort((com1, com2) => compareByDate(com1, com2));
            commentsByDate.push(...comments.filter(com => com.indexOf(';') === -1));
            return commentsByDate;
        default:
            return comments;
    }
}

const countSubstring = (str, substr) => str.length - str.replace(substr, '').length;

function compareByUser(com1, com2) {
    const user1 = com1.substring(0, com1.indexOf(';')).split(' ').slice(2).join(' ');
    const user2 = com2.substring(0, com2.indexOf(';')).split(' ').slice(2).join(' ');
    return user1.localeCompare(user2);
}

function compareByDate(com1, com2) {
    const date1 = new Date(com1.substring(com1.indexOf(';') + 1, com1.lastIndexOf(';')));
    const date2 = new Date(com2.substring(com2.indexOf(';') + 1, com2.lastIndexOf(';')));
    return date2.getTime() - date1.getTime();
}

function getAfterDate(date) {
    const dateTime = Date.parse(date.trimStart());
    return toShow().filter(com => new Date(com.substring(com.indexOf(';') + 1, com.lastIndexOf(';'))).getTime() > dateTime);
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

function processCommand(command) {
    const commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
        case 'show':
            printTable(toShow());
            break;
        case 'important':
            printTable(getImportant());
            break;
        case 'user':
            printTable(getByUser(commands.slice(1).join(' ').toLowerCase()));
            break;
        case 'sort':
            printTable(sortByParameter(commands[1]));
            break;
        case 'date':
            printTable(getAfterDate(commands[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
