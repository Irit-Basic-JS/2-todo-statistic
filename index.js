const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => ({ 
        content: readFile(path), 
        filename: path.split('/').reverse()[0] 
    }));
}

function processCommand(command) {
    const commandArgs = command.split(' ');
    let comments = [];
    switch (commandArgs[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            comments = getComments();
            break;
        case 'important':
            comments = getComments().filter(x => x.important);
            break;
        case 'user':
            comments = getComments().filter(x => x.user.toLowerCase().includes(commandArgs[1].toLowerCase()));
            break;
        case 'sort':
            comments = getSortedComments(commandArgs[1]);
            break;
        case 'date':
            comments = getComments().filter(x => x.date > Date.parse(commandArgs[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
    if (comments) showComments(comments);
}

function getSortedComments(sortingType) {
    switch (sortingType) {
        case 'importance':
            return getComments().sort((a, b) => +b.important - +a.important);
        case 'user':
            return getComments().sort((a, b) => a.user.localeCompare(b.user));
        case 'date':
            return getComments().sort((a, b) => +b.date - +a.date);
        default:
            return 'wrong command';
    }
}

const TODOSTRING = "// TODO";

function getComments() {
    let matches = [];
    for (let file of files) {
        let lines = file.content.split('\n').filter(x => x.includes(TODOSTRING) && !x.includes(`"${TODOSTRING}"`));
        for (let line of lines) {
            let tokens = line.substring(line.indexOf(TODOSTRING) + TODOSTRING.length).split('; ');
            let match = { 
                important: line.includes('!'),
                user: tokens.length < 3 ? "" : tokens[0],
                date: Date.parse(tokens[1]),
                text: tokens[2] || tokens[0],
                filename: file.filename,
            };
            matches.push(match);
        }
    }
    return matches;
}

function showComments(comments) {
    strings = getCommentStrings(comments);
    let divider = Array(strings[0].length).fill('-').join('')
    console.log(strings[0]);
    console.log(divider);
    strings.slice(1).forEach(x => console.log(x));
    console.log(divider);
}

const fieldSizeLimit = [ 1, 10, 10, 50, 15 ];

function getCommentStrings(comments) {
    let commentArrs = [];
    commentArrs.push(['!', 'user', 'date', 'comment', 'filename']);
    comments.forEach(x => commentArrs.push(formatComment(x)));
    
    for (let i = 0; i < fieldSizeLimit.length; i++) {
        let fieldSizes = [];
        commentArrs.forEach(x => fieldSizes.push(x[i].trim().length));

        let fieldSize = Math.min(Math.max(...fieldSizes), fieldSizeLimit[i]);
        commentArrs.forEach(x => x[i] = `  ${x[i].padEnd(fieldSize, ' ')}  `);
    }
    return commentArrs.map(x => x.join('|'));
}

function formatComment(comment) {
    let commentAdapted = [];
    commentAdapted = [
        comment.important ? "!" : "",
        comment.user.toLowerCase().trim(),
        comment.date ? new Date(comment.date).toISOString().substring(0, 10) : "",
        comment.text.replace('!', '').trim(),
        comment.filename
    ];
    let result = [];
    for (let i = 0; i < commentAdapted.length; i++) {
        let shortened = commentAdapted[i].length > fieldSizeLimit[i] ? 
            `${commentAdapted[i].substring(0, fieldSizeLimit[i] - 1)}…` :
            commentAdapted[i];
        result.push(shortened);
    }
    return result;
}

// TODO you can do it!
