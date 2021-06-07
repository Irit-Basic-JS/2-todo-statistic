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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(show());
            break;
        case 'important':
            console.log(important());
            break;
        case 'user':
            console.log(user(split[1]));
            break;
        case 'sort':
            switch (split[1]){
                case 'importance':
                    console.log(sortImportance());
                    break;
                case 'user':
                    console.log(sortUser());
                    break;
                case 'data':
                    console.log(sortDate());
                    break;
            }
            break;
        case 'date':
            console.log(date(split[1]));
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
    let str = show();
    let result = [];
    for (let i of str) {
        if (i.includes('!')) {
            result.push(i);
        }
    }
    return result;
}

function user(userName) {
    return show().filter(line => line.toLowerCase().startsWith(`${userName.toLowerCase()};`));
}

function sortImportance() {
    return show().sort((a, b) => b.split("!").length - a.split("!").length);
}

function sortUser() {
    return show().sort((a, b) => {
        let aUser = a.toLowerCase().split(';');
        let bUser = b.toLowerCase().split(';');
        if (aUser.length !== 1) {
            if (aUser > bUser)
                return 1;
            if (aUser < bUser)
                return -1;
            return 0;
        }
        else if (bUser.length === 1) {
            return -1;
        }
        return 0;
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

// TODO you can do it!
//░░░░░░▄▄▄▄███▄▄▄▄░░░░░░░░░░░░░
//░░░▄▄█▀░░░░░░░░░▀▀▄▄░░░░░░░░░░
//░░█▀░░░░░░░░░░░░░░░▀█▄░░░░░░░░
//░█▀░░░░░░░░░░░░░░░░░░█▄░░░░░░░
//██░░░░░░░░░░░░░░░░░░░░█▄░░░░░░
//█░░░░░░░░░░░░░░░░░░░░░░█▄░░░░░
//██░░░░░░░░░░░░▄▄▄▄▄█▀▀▀██▄░░░░
//▀█░░░░░░░░░▄█▀▀░░▀▀█▄░░░░█▄░░░
//░█▄░▄░░░░░▄█░░░░░░░░█▄░█░░█░░░
//░▄█▄██▄░░░█▄░░██░░░░██▄▄▄██░░░
//░████░▀▀░░░█▄░░░░░░▄█░░░░░██░░
//░█░░██▄▄░░░░▀██▄▄██▀▄▄▄▄▄▄█░░░
//░░▄█▀░░░░░░░░░▄▄██▀▀▀▀▀▀▀░▀█▄░
//░░▀█░░░░░░░▄█▀▀░░░░░░░░░░░░░█▄
//░░░▀█▄▄█▀░█▀░░░░░░░░░░░░░░░▄█▀
//░░░░░░██░▄█░░░█▀██▀▀█▀██▀▀▀▀░░
//░░░░░▄█░░▀█░░▀█░█░░██░██░░░░░░
//░░░░██▀█▄░▀█▄░▀▀████▀▀██░░░░░░
//░░░░█░░░▀▀█▄▀█▄▄▄▄▄▄▄▄██▄░░░░░
