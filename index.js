const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let option = command.split(' ');
    switch (option[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(formatTable(show()));
            break;
        case 'important':
            console.log(formatTable(important()));
            break;
        case 'user':
            console.log(formatTable(user(option[1])));
            break;
        case 'sort':
            switch (option[1]) {
                case 'importance':
                    console.log(formatTable(sortImportance()));
                    break;
                case 'user':
                    console.log(formatTable(sortUser()));
                    break;
                case 'date':
                    console.log(formatTable(sortDate()));
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
            break;
        case 'date':
            console.log(formatTable(date(option[1])));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show() {
    let res = [];
    files.map(code => code.split("\r\n")
        .filter(line => line.includes("// TODO ") && !line.includes("\"// TODO \"")))
        .forEach(t => t.forEach(line => res.push(line.split("// TODO ")[1])));
    return res;
}

function important() {
    return show().filter(line => line.endsWith("!"));
}

function user(userName) {
    return show().filter(line => line.toLowerCase().startsWith(`${userName.toLowerCase()};`));
}

function sortImportance() {
    return show().sort((a, b) => b.split("!").length - a.split("!").length);
}

function sortUser() {
    return show().sort((a, b) => {
        let nameA=a.toLowerCase(), nameB=b.toLowerCase()
        if (a.split(";").length !== 1) {
            if (nameA < nameB)
                return -1
            if (nameA > nameB)
                return 1
            return 0;
        } else if (b.split(";").length === 1) {
            return -1;
        } else {
            return 0;
        }
    });
}

function sortDate() {
    return show().sort((a, b) => {
        let aInfo = a.split("; "), bInfo = b.split("; ");
        if (aInfo.length === 3) {
            if (aInfo[1] > bInfo[1])
                return -1;
            if (aInfo[1] < bInfo[1])
                return 1;
            return 0;
        } else if (bInfo.length === 1) {
            return -1;
        } else {
            return 0;
        }
    });
}

function date(value) {
    return show().filter(a => {
        let aInfo = a.split("; ");
        if (aInfo.length === 3) return (aInfo[1] > value);
        return false;
    });
}

function truncateString (str, len) {
    let strSlice = str.slice(0, len);
    return strSlice === str ? str + ' '.repeat(len - str.length) : strSlice.slice(0, len-3) + "...";
}

function formatTable(value) {
    const sep = "  |  ";
    let userMaxLength = 4;  // "user".length;
    let dateMaxLength = 4;  // "date".length;
    let commentMaxLength = 7;  // "comment".length;
    value.forEach(line => {
        const lineInfo = line.split("; ");
        if (lineInfo.length === 3) {
            userMaxLength = Math.max(userMaxLength, lineInfo[0].length);
            dateMaxLength = Math.max(dateMaxLength, lineInfo[1].length);
            commentMaxLength = Math.max(commentMaxLength, lineInfo[2].length);
        } else {
            commentMaxLength = Math.max(commentMaxLength, lineInfo[0].length);
        }
    });
    userMaxLength = Math.min(userMaxLength, 10);
    commentMaxLength = Math.min(commentMaxLength, 50);
    let res = value.map(line => {
        const lineInfo = line.split("; ");
        if (lineInfo.length === 3) {
            const important = lineInfo[2].endsWith("!") ? '!' : ' ';
            lineInfo[0] = truncateString(lineInfo[0], userMaxLength);
            lineInfo[2] = truncateString(lineInfo[2], commentMaxLength);
            return important + sep + lineInfo.join(sep);
        } else {
            const important = lineInfo[0].endsWith("!") ? '!' : ' ';
            lineInfo[0] = truncateString(lineInfo[0], commentMaxLength);
            return important + sep + ' '.repeat(userMaxLength) + sep + ' '.repeat(10) + sep + lineInfo[0];
        }
    });
    let titleUser = truncateString("user", userMaxLength);
    let titleDate = truncateString("date", dateMaxLength);
    let titleComment = truncateString("comment", commentMaxLength);
    const title = "!" + sep + titleUser + sep + titleDate + sep + titleComment;
    const titleLine = '-'.repeat(title.length);
    res.unshift(title, titleLine);
    res.push(titleLine);
    return res;
}

// TODO Макар крутой!
// TODO you can do it!
// TODO qqq!
// TODO bbb!
// TODO you can do it?
