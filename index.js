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
            console.log(getImportant());
            break;
        case 'user':
            console.log(getComments(commands[1]));
            break;
        case 'sort':
            switch (commands[1]){
                case 'importance':
                    console.log(sortImp());
                    break;
                case 'user':
                    console.log(sortUser());
                    break;
                case 'date':
                    console.log(sortDate());
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() {
    let result = [];
    let index;
    for(let file of files) {
        let arr = file.split('\r\n'); 
        for(let str of arr) {
            if(str.includes('// TODO') && !str.includes('\'// TODO')) {
                index = str.indexOf('// TODO');
                result.push(str.slice(index));
            }
        }
    }
    return result;
}

function getImportant(){
    let allTODO = toShow();
    let result = [];
    for(let str of allTODO) {
        if(str.includes('!')) result.push(str);
    }
    return result;
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

function sortImp() {
    let allTODO = toShow();
    return allTODO.sort(compareImp);
}

function sortUser() {
    let newAllTODO = toShow().sort().sort(compareUser);
    return newAllTODO;
}

function sortDate() {
    let allTODO = toShow();
    return allTODO.sort(compareDate);
}

function compareImp(a, b) {
    return b.split('!').length - a.split('!').length; //если меньше 0, то a будет первее, если больше 0, то b будет первее
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
