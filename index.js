const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const maxNameLength = 10;
const maxDateLength = 10;
const maxTextLength = 50;
const whiteSpace = '  ';
const whiteSpaceEnd = ' ';
const wallSymbol = '|';
const headerSep = '-';

const commentStart = '// TODO ';

console.log('Please, write your command!');
readLine(processCommand);


function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let formattedCommand = command.split(' ')[0];

    switch (formattedCommand) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showCommand()
            break;
        case 'important':
            importantCommand();
            break;
        case 'user':
            userCommand(command);
            break;
        case 'sort':
            sortCommand(command);
            break;
        case 'date':
            dateCommand(command);
            break;
        default:
            console.log('wrong command');
            getComments();
            break;
    }
}

function dateCommand(command){
    let args = command.split(' ');
    let date = Date.parse(args[1]);
    let comments = getComments().filter(value => value.date > date);

    printComments(comments, c => true);
}

function sortCommand(command) {
    let mode = getModeFromCommand(command);
    let comments = getComments();
    switch (mode) {
        case 'importance':
            comments.sort((a, b) => (a.importance > b.importance) ? -1 : 1);
            break;
        case 'user':
            comments.sort(((a, b) =>{
                if (a.userName === undefined)
                    return 1;

                if (b.userName === undefined)
                    return -1;

                if (a.userName === b.userName)
                    return 0;

                return a.userName > b.userName ? 1 : -1;
            }));
            break;
        case 'date':
            comments.sort((a, b) => {
                if (a.date === undefined) {
                    return 1;
                }
                if (b.date === undefined) {
                    return -1;
                }

                return a.date > b.date ? -1: 1;
            });
            break;
        default:
            console.log("Incorrect sort command!");
            break;
    }

    printComments(comments, c => true);
}

function getModeFromCommand(command) {
    let args = command.split(' ');
    if (args.length !== 2) {
        return undefined;
    }
    return args[1];
}

function userCommand(command) {
    let userName = getUserNameFromCommand(command).toLowerCase();
    let comments = getComments();

    if (userName === undefined)
        return;

    printComments(comments, c => c.userName !== undefined &&  userName === c.userName.toLowerCase());
}

function getUserNameFromCommand(command) {
    let commandStart = "user ";
    if (!command.startsWith("user ")) {
        return undefined;
    }

    return command.substr(commandStart.length);
}

function importantCommand() {
    let commentsList = getComments();
    printComments(commentsList, c => c.importance > 0);
}

function showCommand() {
    let commentsList = getComments();
    printComments(commentsList, c => true);
}

function printComments(comments, func) {
    comments = comments.filter(func);

    let maxUserName = Math.max.apply(null, comments.map(c => c.userName === undefined ? 0 : c.userName.length));
    let nameLength = Math.min(maxNameLength, maxUserName);

    let maxDate = comments.some(c => c.date !== undefined) ? maxDateLength : 0;
    let dateLength = Math.min(maxDate, maxDateLength);

    let maxText = Math.max.apply(null, comments.map(c => c.text.length));
    let textLength = Math.min(maxTextLength, maxText)

    let header = {
        userName: 'user',
        date: 'date',
        text: 'comment',
        importance: 1
    }

    let headerString = convertComment(header, nameLength, textLength, dateLength);
    let sep = headerSep.repeat(headerString.length);
    console.log(headerString);
    console.log(sep);

    for (let comment of comments){
        console.log(convertComment(comment, nameLength, textLength, dateLength));
    }
}

function convertComment(comment, nameLength, textLength, dateLength) {
    let importance = comment.importance > 0 ? '!' : ' ';
    let name = comment.userName === undefined
        ? convertString('', nameLength)
        : convertString(comment.userName, nameLength);

    let dateString;

    if (comment.date === undefined) {
        dateString = convertString('', dateLength);
    }
    else if (typeof comment.date === 'string'){
        dateString = convertString(comment.date, dateLength);
    }
    else {
        let day = comment.date.getDate();
        let month = comment.date.getMonth() + 1;
        let year = comment.date.getFullYear();
        dateString = `${year}-${correctDateNumber(month)}-${correctDateNumber(day)}`
    }
    let text = convertString(comment.text, textLength);

    let separtor = whiteSpace + wallSymbol + whiteSpace;
    return whiteSpace + importance + separtor + name + separtor + dateString + separtor + text;

    function correctDateNumber(number) {
        let addStr = number <= 9 ? '0' : '';
        return addStr + number;
    }
}

function convertString(text, length){
    if (text === undefined) {
        return whiteSpaceEnd.repeat(length);
    }

    if (text.length <= length) {

        return text + whiteSpaceEnd.repeat(length - text.length);
    }

    let end = '...';

    return text.substr(0, length - end.length) + end;
}

function getComments() {
    let commentsList = [];
    for (let file of files)
    {
        let lines = file.split('\r\n');

        for (let line of lines){
            let comment = getComment(line);
            let commentInfo = comment !== undefined ? ParseComment(comment) : undefined;
            if (comment !== undefined && commentInfo !== undefined) {
                commentsList.push(commentInfo);
            }
        }
    }

    return commentsList;
}

function ParseComment(comment) {
    let commentSections = comment.split(';');

    if (commentSections.length === 1) {
        return {
            userName: undefined,
            date: undefined,
            text: comment.substr(commentStart.length),
            importance: countImportance(commentSections[0])
        }
    }

    if (commentSections.length !== 3) {
        return undefined;
    }

    let userName = commentSections[0].substr(commentStart.length);
    let date = new Date(Date.parse(commentSections[1]));
    let text = commentSections[2].trim();

    return {
        userName,
        date,
        text,
        importance: countImportance(text)
    }
}

function countImportance(commentText) {
    let count = 0;
    for (let i = 0; i < commentText.length; i++) {
        if (commentText[i] === '!')
            count++;
    }
    return count;
}

function getComment(line){
    let commentLength = commentStart.length;
    let comparingIndex = 0;
    let isComparing = false;

    let commentStartIndex = 0;
    let isFound = false;

    for (let i = 0; i < line.length; i++){
        if (!isComparing && line[i] === '/') {
            commentStartIndex = i;
            isComparing = true;
        }

        if (isComparing)
        {
            let isSymbolsEqual = commentStart[comparingIndex] === line[i];

            if (!isSymbolsEqual)
            {
                isComparing = false;
                comparingIndex = 0;
                commentStartIndex = 0;
            }

            if (isSymbolsEqual && comparingIndex + 1 >= commentLength)
            {
                isFound = true;
                break;
            }

            comparingIndex++;
        }
    }

    //if (isFound)
        //console.log("Comment: " + line.substr(commentStartIndex, line.length - commentStartIndex));

    return isFound ? line.substr(commentStartIndex, line.length - commentStartIndex) : undefined;
}



// TODO you can do it!
// TODO PE; 2020-12-11; Что это???
// TODO Veronika; 2020-12-10; Тут бы поправить!!