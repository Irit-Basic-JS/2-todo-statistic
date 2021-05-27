const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllToDo() {
    let toDoLines = [];
    let text = getFiles().join();
    let lines = text.split('\n')
    for (let line of lines) {
        if (line.includes('// TODO ') && !line.includes('delete this one from toDoLines'))
            toDoLines.push(line); // delete this one from toDoLines
    }
    let result = toDoLines.map(item => item.slice(item.indexOf('/') + 8));
    return result;
}

function getImportant() {
    let importantComms = [];
    let allComms = getAllToDo();
    for (let comm of allComms) {
        if (comm.includes('!')) {
            importantComms.push(comm)
        }
    }
    return importantComms;
}

function howManyTimesIncl(string, symbol, timesNumber) {
    let strToArr = string.split('');
    let counter = 0;
    for (let sym of strToArr) {
        if (sym === symbol) counter++;
    }
    return counter === timesNumber;
}

function getUnformatted() {
    let unformattedComms = [];
    let allComms = getAllToDo();
    for (let comm of allComms) {
        if (!isFormatted(comm)) {
            unformattedComms.push(comm);
        }
    }
    return unformattedComms;
}

function getFormatted() {
    let formattedComms = [];
    let allComms = getAllToDo();
    for (let comm of allComms) {
        if (isFormatted(comm)) {
            formattedComms.push(comm);
        }
    }
    return formattedComms;
}

function getByUsername(username) {
    let formattedComms = getFormatted();
    let userComms = [];
    username = username.toLowerCase();
    for (let comment of formattedComms) {
        if (comment.split(';')[0].trim().toLowerCase() === username) {
            userComms.push(comment);
        }
    }
    return userComms;
}

function getSortedByDate() {
    let comments = getFormatted()
    let sortedComments = comments.sort(function (a, b) {
        let aDate = new Date(a.split(';')[1].trim());
        let bDate = new Date(b.split(';')[1].trim());
        return (aDate.getFullYear() * 256 + (aDate.getMonth() + 1) * 30 + aDate.getDate()) - (bDate.getFullYear() * 256 + (bDate.getMonth() + 1) * 30 + bDate.getDate());
    });
    for (let comment of getUnformatted()) {
        sortedComments.push(comment);
    }
    return sortedComments.reverse();
}

function getSortedByImportance() {
    let comms = getAllToDo();
    let sortedComms = comms.sort(function(a, b) {
        return a.replace(/[^!]/g, "").length - b.replace(/[^!]/g, "").length;
    })
    return sortedComms.reverse();
}

function getSortedByUsers() {
    let users = [];
    let comms = getFormatted();
    for (let comment of comms) {
        let user = comment.split(';')[0].trim().toLowerCase();
        users.push(user);
    }
    users = unique(users);
    let result = [];
    for (let user of users) {
        let userComms = getByUsername(user);
        for (let comm of userComms) {
            result.push(comm);
        }
    }
    for (let comm of getUnformatted()) {
        result.push(comm);
    }
    return result;
}


function unique(arr) {
    let result = [];
    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }
    return result;
}

function isFormatted(comment) {
    return howManyTimesIncl(comment, ';', 2);
}

function getFilteredByDate(date) {
    let comms = getFormatted();
    let filteredComms = comms.filter(comm => {
        return new Date(comm.split(';')[1].trim()) > date;
    });
    return filteredComms;
}

function clearStrings(...strings) {
    for (let str of strings) str = '';
}

function showOnConsole(comments) {

    console.log(`  !  |  ${'user'.padEnd(10, ' ')}  |  ${'date'.padEnd(10, ' ')}  |  comment  `);
    console.log(`${'-'.repeat(88)}`);
    let frmtdImportance = '';
    let frmtdUsername = '';
    let frmtdDate = '';
    let frmtdComment = '';

    for (let comment of comments) {
        if (!isFormatted(comment)) {
            frmtdUsername = 'Unknown   ';
            frmtdDate = 'Unknown   ';
            frmtdImportance = comment.includes('!') ? '!' : ' ';
            frmtdComment = comment.length <= 50 ? comment.padEnd(50, ' ') : comment.slice(0,47) + '...';
            console.log(`  ${frmtdImportance}  |  ${frmtdUsername}  |  ${frmtdDate}  |  ${frmtdComment}  `);
            clearStrings(frmtdImportance, frmtdUsername, frmtdDate, frmtdComment);
        }

        else {
            let splittedComment = comment.split(';');
            frmtdImportance = comment.includes('!') ? '!' : ' ';
            let username = splittedComment[0].trim().toLowerCase();
            frmtdUsername = username.length <= 10 ? username.padEnd(10, ' ') : username.slice(0,7) + '...';
            frmtdDate = splittedComment[1].trim();
            let onlyComment = splittedComment[2].trim();
            frmtdComment = onlyComment.length <= 50 ? onlyComment.padEnd(50, ' ') : onlyComment.slice(0,47) + '...';
            console.log(`  ${frmtdImportance}  |  ${frmtdUsername}  |  ${frmtdDate}  |  ${frmtdComment}  `);
            clearStrings(frmtdImportance, frmtdUsername, frmtdDate, frmtdComment);
        }
    }
    console.log(`${'-'.repeat(88)}`);
}

function processCommand(command) {
        let splittedCommand = command.split(' ');
            switch (splittedCommand[0]) {
                case 'exit':
                    process.exit(0);
                    break;
                case 'show':
                    showOnConsole(getAllToDo());
                    break;
                case 'important':
                    showOnConsole(getImportant());
                    break;
                case 'user':
                    let username = splittedCommand[1];
                    showOnConsole(getByUsername(username));
                    break;
                case 'sort':
                    switch (splittedCommand[1]) {
                        case 'importance':
                            showOnConsole(getSortedByImportance());
                            break;
                        case 'user':
                            showOnConsole(getSortedByUsers());
                            break;
                        case 'date':
                            showOnConsole(getSortedByDate());
                            break;
                        default:
                            console.log('Command \'sort ...\' supports only these arguments: \'importance\', \'user\', \'date\'');
                            break;
                    }
                    break;
                case 'date':
                    showOnConsole(getFilteredByDate(new Date(splittedCommand[1])));
                    break;
                case 'debug':
                    let dates = [];
                    for (let coment of getFormatted()) {
                        let date = new Date(coment.split(';')[1].trim());
                        dates.push(date.getFullYear());
                    }
                    console.log(dates);
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
}
// TODO you can do it!
