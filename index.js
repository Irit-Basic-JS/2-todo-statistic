const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(fullCommand) {
    const [command, arg] = fullCommand.split(' ');

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getComments().map(x => x.text));
            break;
        case 'important':
            console.log(getCommentsByImportance().map(x => x.text));
            break;
        case 'user':
            console.log(getCommentsByUser(arg).map(x => x.text));
            break;
        case 'sort':
            console.log(sortCommentsBy(arg).map(x => x.text));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function Comment (comment) {
    const splits = comment.split('; ');

    this.text = comment;
    this.instruction = splits.pop();
    this.date = new Date(splits.pop());
    this.user = splits.pop()?.toLowerCase();
    this.importance = comment.includes('!');
}

function getComments () {
    const files = getFiles();
    const re = /\/\/ TODO (.+)\r\n/g;
    const comments = [];
    
    for (let file of files) {
        const matchedComments = file.matchAll(re);
    
        for (let comment of matchedComments) {
            comments.push( new Comment(comment[1]) );
        }
    }

    return comments;
}

function getCommentsByImportance () {
    const comments = getComments();
    return comments.filter(x => x.importance);
}

function getCommentsByUser (user) {
    const comments = getComments();
    return comments.filter(x => x.user === user.toLowerCase());
}

function sortCommentsBy (arg) {
    const comments = getComments();
    
    switch (arg) {
        case 'importance': 
            comments.sort((a, b) => b.text.split('!').length - a.text.split('!').length);
            break;
        case 'user':
            comments.sort((a, b) => {
                if (a.user > b.user) return 1;
                if (a.user < b.user) return -1;
                return 0;
            })
            break;
        case 'date':
            comments.sort((a, b) => b.date - a.date);
            break;
    }

    return comments;
}
