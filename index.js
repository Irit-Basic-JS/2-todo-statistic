const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const maxWidth = [1, 10, 10, 50, 20];

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
            console.log( formatToTable(getComments()) );
            break;
        case 'important':
            console.log( formatToTable(getCommentsByImportance()) );
            break;
        case 'user':
            console.log( formatToTable(getCommentsByUser(arg)) );
            break;
        case 'sort':
            console.log( formatToTable(sortCommentsBy(arg)) );
            break;
        case 'date':
            console.log( formatToTable(getCommentsByDate(arg)) );
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
    this.date = splits.pop() ?? '';
    this.user = splits.pop()?.toLowerCase() ?? '';
    this.importance = comment.includes('!') ? '!' : '';
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    for (let path of filePaths) {
        if (readFile(path).includes(this.text)) {
            this.fromFile = '..' + path.match(/\/.+/)[0];
            break;
        }
    }
}

function formatToTable (comments) {
    const widthColumn = getWidthColumn(comments);
    const title = { 
        importance: '!',
        user: 'user',
        date: 'date',
        instruction: 'comment',
        fromFile: 'file path',
    }
    const table = [];
    table.push(getRow(title, widthColumn));

    for (let comment of comments) {
        const row = getRow(comment, widthColumn);
        table.push(row);
    }
    
    addBounds(table);

    return table.join('\n');
}

function addBounds (table) {
    const maxLength = Math.max(...table.map(x => x.length));
    table.splice(1, 0, ('-'.repeat(maxLength + 2)));
    table.push('-'.repeat(maxLength + 2));
}

function truncateString (str, length) {
    const ellipsis = '\u2026';
    let result = str;

    if (str.length > length) {
        result = str.slice(0, length - 1) + ellipsis;
    }

    return result;
}

function getRow (comment, widthColumn = maxWidth) {
    const row = [
        truncateString(comment.importance, 1).padEnd(widthColumn[0]),
        truncateString(comment.user, 10).padEnd(widthColumn[1]),
        truncateString(comment.date, 10).padEnd(widthColumn[2]),
        truncateString(comment.instruction, 50).padEnd(widthColumn[3]),
        truncateString(comment.fromFile, 20).padEnd(widthColumn[4])
    ];

    return '  ' + row.join('  |  ');
}

function getWidthColumn (comments) {
    const width = [1, 4, 4, 7, 9];

    for (let comment of comments) {
        width[0] = Math.min(Math.max(comment.importance.length, width[0]), maxWidth[0]);
        width[1] = Math.min(Math.max(comment.user.length, width[1]), maxWidth[1]);
        width[2] = Math.min(Math.max(comment.date.length, width[2]), maxWidth[2]);
        width[3] = Math.min(Math.max(comment.instruction.length, width[3]), maxWidth[3]);
        width[4] = Math.min(Math.max(comment.fromFile.length, width[4]), maxWidth[4]);
    }

    return width;
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

function getCommentsByDate (date) {
    const comments = getComments();
    return comments.filter(x => new Date(x.date) > new Date(date));
}

function sortCommentsBy (arg) {
    const comments = getComments();
    
    switch (arg) {
        case 'importance': 
            comments.sort((a, b) => b.text.split('!').length - a.text.split('!').length);
            break;
        case 'user':
            comments.sort((a, b) => {
                if (a.user < b.user) return 1;
                if (a.user > b.user) return -1;
                return 0;
            })
            break;
        case 'date':
            comments.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }

    return comments;
}
