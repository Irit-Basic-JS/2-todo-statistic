const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

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
        default:
            console.log('wrong command');
            getComments();
            break;
    }
}

function userCommand(command) {
    let userName = getUserNameFromCommand(command);
    let comments = getComments();

    for (let comment of comments) {
        if (userName !== undefined && userName === comment.userName) {
            console.log(convertComment(comment));
        }
    }
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
    for (let comment of commentsList){
        if (comment.importance > 0) {
            console.log(convertComment(comment));
        }
    }
}

function showCommand() {
    let commentsList = getComments();
    for (let comment of commentsList){
        console.log(convertComment(comment));
    }
}

function convertComment(comment) {
    if (comment.date === undefined || comment.userName === undefined){
        return `Anonym: ${comment.text}`;
    }

    let day = comment.date.getDate();
    let month = comment.date.getMonth();
    let year = comment.date.getFullYear();

    return `(${day}-${month}-${year}) ${comment.userName}: ${comment.text}`;
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
            text: commentSections[0],
            importance: countImportance(commentSections[0])
        }
    }

    if (commentSections.length !== 3) {
        return undefined;
    }

    let userName = commentSections[0].substr(commentStart.length);
    let date = new Date(Date.parse(commentSections[1]));
    let text = commentSections[2];

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
