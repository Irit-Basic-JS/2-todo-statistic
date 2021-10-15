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
    const commandParameters = command.split(' ');
    let comments = [];
    switch (command) {
        case 'exit':
            process.exit(0);
        case 'show':
            comments = getAllComments();
            break;
        case 'important':
            comments = getAllComments().filter(x => x.important);
            break;
        case 'user':
            comments = getAllComments().filter(x => x.user.toLowerCase().includes(commandParameters[1].toLowerCase()));
            break;
        case 'sort':
            comments = getSortedComments(commandParameters[1]);
            break;
        case 'date':
            comments = getAllComments().filter(x => x.date > Date.parse(commandParameters[1]));
            break;
        default:
            break;
    }
    if (comments) printComments (comments);
    else console.log('wrong command');
}

function getSortedComments(sortingParameter){
    switch(sortingParameter){
        case 'important':
            return getAllComments().sort((x, y) => +y.important - +x.important);
        case 'user':
            return getAllComments().sort((x, y) => x.user.localeCompare(y.user));
        case 'date':
            return getAllComments().sort((x, y) => +y.date - +x.date)
        default:
            return;
    }
}

function getAllComments() {
    const TODOSTR = "// TODO";
    let matches = [];
    let lines = [];
    for (let file of files) {
        let lines = file.content.split('\n').filter(x => x.includes(TODOSTR) && !x.includes(`"${TODOSTR}"`));
        for (let line of lines) {
            let tokensArr = line.substring(line.indexOf(TODOSTR) + TODOSTR.length).split('; ');
            let match = {
                important: line.includes('!'),
                user: tokensArr.length < 3 ? "" : tokensArr[0],
                date: Date.parse(tokensArr[1]),
                text: tokensArr[2] || tokensArr[0],
                filename: file.filename
            };
            matches.push(match)
        }
    }
    return matches;   
}

function printComments(comments){
    strs = getCommentText(comments);
    let divider = Array(strs[0].length).fill('-').join('');
    console.log(strs[0]);
    console.log(divider);
    strs.slice(1).forEach(x => console.log(x));
    console.log(divider);
}

const fieldSizeLimit = [ 1, 10, 10, 50, 15 ];

function getCommentText(comments){
    let commentsArray = [];
    commentsArray.push(['!', 'user', 'date', 'comment', 'filename']);
    comments.forEach(el => commentsArray.push(formatComment(el)));

    for (let i = 0; i < fieldSizeLimit.length; i++){
        let fieldSizes = [];
        commentsArray.forEach(x => fieldSizes.push(x[i].trim().length));

        let fieldSize = Math.min(Math.max(...fieldSizes), fieldSizeLimit[i]);
        commentsArray.forEach(x => x[i] = `  ${x[i].padEnd(fieldSize, ' ')}  `);
    }
    return commentsArray.map(x => x.join('|'));
}


function formatComment(comment){
    let commentSuitable = [];
    commentSuitable = [
        comment.important ? "!" : "",
        comment.user.toLowerCase().trim(),
        comment.date ? new Date(comment.date).toISOString().substring(0, 10) : "",
        comment.text.replace('!', '').trim(),
        comment.filename
    ];
    let res = [];
    for (let i = 0; i < commentSuitable.length; i++){
        let short = commentSuitable[i].length > fieldSizeLimit[i] ?
            `${commentSuitable[i].substring(0, fieldSizeLimit[i] - 1)}…` :
            commentSuitable[i];
        res.push(short);
    }
    return res;
}
// TODO you can do it!
