const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
// const { resourceLimits } = require('node:worker_threads');

const files = getFiles();
const commentStart = '// TODO ';

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let formatCommand = command.split(' ')[0];
    switch (formatCommand) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showCommand();
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
        default:
            console.log('wrong command');
            getComments();
            break; 
    }
}

function showCommand() {
    let commentsList = getComments();
    for (let comment of commentsList) {
        console.log(convertComment(comment));
    }
}

function getComments() {
    let commentsList = [];
    for (let file of files) {
        let lines = file.split('\r\n');
        for (let line of lines) {
            let comment = getComment(line);
            let commentInfo;
            if (comment !== undefined) {
                commentInfo = commentParse(comment);
            }
            else commentInfo = undefined;
            
            if (comment !== undefined && commentInfo !== undefined) {
                commentsList.push(commentInfo);
            }
        }
    }
    return commentsList;
}

function importantCommand() {
    let commentsList = getComments();
    for (let comment of commentsList) {
        if (comment.importance > 0) {
            console.log(convertComment(comment));
        }
    }
}

function userCommand(command) {
    let userName = getUserName(command);
    let comments = getComments();

    for (let comment of comments) {
        if (userName !== undefined && userName === comment.userName) {
            console.log(convertComment(comment));
        }
    }
}

function sortCommand(command) {
    let mode = getMode(command);
    let comments = getComments();
    switch (mode) {
        case 'importance':
            comments.sort((a, b) => (a.importance > b.importance) ? -1 : 1);
            break;
        case 'user':
            comments.sort(((a,b) => {
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

                return a.date > b.date ? -1 : 1;
            });
            break;
        default:
            console.log('Incorrect sort command!');
            break;
    }

    for (let comment of comments) {
        console.log(convertComment(comment));
    }
}

function convertComment(comment) {
    if (comment.date === undefined || comment.userName === undefined) {
        return `Anonym: &{comment.text}`;
    }

    let day = comment.date.getDate();
    let month = comment.date.getMonth() + 1;
    let year = comment.date.getFullYear();
    return `(${day}-${month}-${year}) ${comment.userName}: ${comment.text}`;
}

function getMode(command) {
    let args = command.split(' ');
    if (args.length !== 2) {
        return undefined;
    }
    return args[1];
}

function getUserName(command) {
    let commandStart = 'user ';
    if (!command.startsWith('user ')) {
        return undefined;
    }
    return command.substr(commandStart.length);
}

function commentParse(comment) {
    let commentSections = comment.split(';');
    if (commentSections.length === 1){
        return {
            userName: undefined,
            date: undefined,
            text: commentSections[0],
            importance: importanceCount(commentSections[0])
        }
    }

    if (commentSections.length !== 3) {
        return undefined;
    }

    let userName = commentSections[0].substr(commentStart.length);
    let date = new Date(Date.parse(commentSections[1]));
    let text = commentSections[2];

    return {
        userName, date, text, importance: importanceCount(text)
    }
}

function importanceCount(commentText) {
    let count = 0;
    for (let i = 0; i < commentText.length; i++) {
        if (commentText[i] === '!')
            count++;
    }
    return count;
}

function getComment(line) {
    let commentLength = commentStart.length;
    let commetIndex = 0;
    let comparing = false;
    let commentStartIndex = 0;
    let find = false;

    for (let i = 0; i < line.length; i++){
        if (!comparing && line[i] === '/') {
            commentStartIndex = i;
            comparing = true;
        }

        if (comparing) {
            let symbolsEquality = commentStart[commetIndex] === line[i];
            if (!symbolsEquality) {
                comparing = false;
                commetIndex = 0;
                commentStartIndex = 0;
            }

            if (symbolsEquality && commetIndex + 1 >= commentLength) {
                find = true;
                break
            }

            commetIndex++;
        }
    }

    return find ? line.substr(commentStartIndex, line.length - commentStartIndex) : undefined;
}

// TODO you can do it!