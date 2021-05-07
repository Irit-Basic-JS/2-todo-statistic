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
        let splitCommand = command.split(' ');
        switch (splitCommand[0]) {
            case 'show':
                console.log(showCommand());
                break;
            case 'important':
                console.log(importantCommand());
                break;
            case 'user':
                console.log(findUserCommand(splitCommand[1]));
                break;
            case 'sort':
                switch (splitCommand[1]) {
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
                break;
            default:
                console.log('wrong command');
                break;
        }
}

function showCommand() {
    let result = [];
    let current;
    for (let file of files) {
        let arr = file.split('\r\n'); 
        for (let str of arr) {
            if (str.includes('// TODO') && !str.includes('\'// TODO \'')) {
                current = str.indexOf('// TODO');
                result.push(str.slice(current));
            }
        }
    }
    return result;
}

function importantCommand() {
    let allTODO = showCommand();
    let result = [];
    for (let str of allTODO) {
        if (str.includes('!')) {
            result.push(str);
        }
    }
    return result;
}

function findUserCommand(nameOfUser) {
    let allTODO = showCommand();
    let result = [];
    for (let str of allTODO) {
        let arr = str.split(';');
        let name = arr[0].slice(8);
        let textComment = arr[2];
        if (name.toLowerCase() === nameOfUser.toLowerCase())
            result.push(textComment);
    }
    return result;
}

function sortImportant() {
    let allTODO = showCommand();
    return allTODO.sort(compareImportant);
}

function sortUser() {
    let newAllTODO = showCommand().sort().sort(compareUser);
    return newAllTODO;
}

function sortDate() {
    let allTODO = showCommand();
    return allTODO.sort(compareDate);
}

function compareImportant(x, y) {
    return y.split('!').length - x.split('!').length;
}

function compareUser(x, y) {
    let arrX = x.split(';');
    let arrY = y.split(';');
    if (arrX.length !== 1 && arrY.length !== 1)
    {
        let nameX = arrX[0].slice(8).toLowerCase();
        let nameY = arrY[0].slice(8).toLowerCase();
        if (nameX > nameY) return 1;
        if (nameX < nameY) return -1;
        if (nameX === nameY) return 0;
    }
    else if (arrX.length !== 1 && arrY.length === 1) return -1;

    else if (arrX.length === 1 && arrY.length !== 1) return 1;

    else return 0;
}

function compareDate(x, y) {
    let arrX = x.split(';');
    let arrY = y.split(';');
    if (arrX.length !== 1 && arrY.length !== 1) {
        let dateX = arrX[1].split('-').join('');
        let dateY = arrY[1].split('-').join('');
        if (+dateX > +dateY) return -1;
        else if (+dateX < +dateY) return 1;
        else return 0;
    }
    else if (arrX.length !== 1 && arrY.length === 1) return -1;

    else if (arrX.length === 1 && arrY.length !== 1) return 1;

    else return 0;
}
// TODO you can do it!
