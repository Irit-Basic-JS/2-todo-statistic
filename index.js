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
    let commands = command.split(' ');
    switch (commands[0]) {
        case 'show':
            console.log(toShow());
            break;
        case 'important':
            console.log(getImportant());
            break;
        case 'user':
            console.log(userComments(commands[1]));
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
            break;
        case 'exit':
            process.exit(0);
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() {
    let result = []; 
    let index;
    for (let file of files) {
        let arr = file.split('\r\n');
        for (let str of arr) {
            if (str.includes('// TODO') && !str.includes("\"// TODO \"")) {
                index = str.indexOf('// TODO');
                result.push(str.slice(index));
            }
        }

    }
    return result;
}

function getImportant() {
    let result = [];
    let allComments = toShow();
    for (let str of allComments) {
        if (str.includes('!')) {
            result.push(str);
        }
    }
    return result;

}

function userComments(username) {
    let result = [];
    result = toShow().filter(line => line.toLowerCase().startsWith(`${username.toLowerCase()};`));
    return result;
}

function sortImportant() {
    let allComments = toShow();
    return allComments.sort(compareImportant);
}

function sortUser() {
    let newAllComments = toShow().sort().sort(compareUser);
    return newAllComments;
}

function sortDate() {
    let allComments = toShow();
    return allComments.sort(compareDate);    
}

function compareImportant(a, b) {
    return b.split('!').length - a.split('!').length; 
}

function compareUser(a, b) {
    let arrA = a.split(';');
    let arrB = b.split(';');
    if(arrA.length !== 1 && arrB.length !== 1)
    {
        let nameA = arrA[0].slice(8).toLowerCase();
        let nameB = arrB[0].slice(8).toLowerCase();
        if(nameA > nameB) return 1;
        if(nameA < nameB) return -1;
        if(nameA === nameB) return 0;
    }
    else if(arrA.length !== 1 && arrB.length === 1) return -1;

    else if(arrA.length === 1 && arrB.length !== 1) return 1;

    else return 0;
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