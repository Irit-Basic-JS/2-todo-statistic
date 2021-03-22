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
    let commands = command.split(" ");
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(toShow());
            break;
        case 'important':
            console.log(toImportant());
            break;
        case 'user':
            console.log(getComments(commands[1]));
            break;
        case 'sort':
        switch (commands[1]){
            case 'importance':
                console.log(sortImportant());
                break;
            case 'user':
                console.log(sortUser());
                break;
            case 'date':
                console.log(sortDate());
                break;
            }
        default:
            console.log('wrong command');
            break;
    }
}

function toShow(){
    let result = [];
    for(let file of files) {
        for(let str of file.split('\r\n')) {
            if(str.includes('// TODO') && !str.includes('\'// TODO')) {
                result.push(str.slice(str.indexOf('// TODO')));
            }
        }
    }
    return result;
}

function toImportant(){
    let allTODO = toShow();
    let res = [];
    for(let str of allTODO) {
        if(str.includes('!')) res.push(str);
    }
    return res;
}

function getComments(username) {
    let allTODO = toShow();
    let result = [];
    for(let str of allTODO){
        let arr = str.split(';');
        let name = arr[0].slice(8);
        let comment = arr[2];
        if(name.toLowerCase() === username.toLowerCase())
            result.push(comment);
    }
    return result;
}

function sortImportant() {
    return toShow().sort(compareImportant);
}

function compareImportant(a, b) {
    return b.split('!').length - a.split('!').length;
}

function sortUser() {
    return show().sort((a, b) => {
        let userA = a.toLowerCase().split(';');
        let userB = b.toLowerCase().split(';');
        if (userA.length !== 1) {
            if (userA > userB)
                return 1;
            if (userA < userB)
                return -1;
            return 0;
        }
        else if (userB.length === 1) {
            return -1;
        }
        return 0;
    });
}


function sortDate() {
    let allTODO = toShow();
    return allTODO.sort(compareDate);
}

function compareDate(a, b) {
    let arrA = a.split(';');
    let arrB = b.split(';');
    if(arrA.length !== 1 && arrB.length !== 1) {
        let dateA = arrA[1].split('-').join('');
        let dateB = arrB[1].split('-').join('');
        if(+dateA > +dateB) return -1;
        else if(+dateA < +dateB) return 1;
        else return 0;
    }
    else if(arrA.length !== 1 && arrB.length === 1) return -1;
    else if(arrA.length === 1 && arrB.length !== 1) return 1;
    else return 0;
}

// TODO you can do it!
