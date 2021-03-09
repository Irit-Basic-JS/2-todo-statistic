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
        let commentUserName = getUserNameFromComment(comment);
        if (commentUserName !== undefined && userName === commentUserName) {
            console.log(comment);
        }
    }
}

function getUserNameFromComment(comment) {
    let startIndex = commentStart.length;
    let endIndex = comment.indexOf(';', startIndex);
    if (endIndex === -1){
        return undefined;
    }
    return comment.substring(startIndex, endIndex);
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
        if (comment[comment.length - 1] === '!')
            console.log(comment);
    }
}

function showCommand() {
    let commentsList = getComments();
    for (let comment of commentsList){
        console.log(comment);
    }
}

function getComments() {
    let commentsList = [];
    for (let file of files)
    {
        let lines = file.split('\r\n');

        for (let line of lines){
            //console.log("line: " + line + "---END---");
            let comment = getComment(line);
            if (comment !== undefined) {
                commentsList.push(comment);
            }
        }
    }

    return commentsList;
}

function getComment(line){
    let commentLength = commentStart.length;
    let commentIndex = 0;
    let isComparing = false;

    let commentStartIndex = 0;
    let isFound = false;

    let length = line.length;
    for (let i = 0; i < length; i++){
        if (!isComparing && line[i] === '/') {
            commentStartIndex = i;
            isComparing = true;
        }

        if (isComparing)
        {
            let isSymbolsEqual = commentStart[commentIndex] === line[i];

            if (!isSymbolsEqual)
            {
                isComparing = false;
                commentIndex = 0;
                commentStartIndex = 0;
            }

            if (isSymbolsEqual && commentIndex + 1 >= commentLength)
            {
                isFound = true;
                break;
            }

            commentIndex++;
        }
    }


    let comment = line.substr(commentStartIndex, length - commentStartIndex);
    return isFound ? line.substr(commentStartIndex, length - commentStartIndex) : undefined;
}



// TODO you can do it!
