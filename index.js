const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODO() {
    let TODOList = [];
    let example = '// TODO';
    for (let file of files) {
        for (let str of file.split('\r\n')) {
            if (str.includes(example) && !str.includes('\'' + example))
                TODOList.push(str.slice(str.indexOf(example)));
        }
    }
    return TODOList;
}

function getImportant() {
    return getTODO().filter((str) => str.includes('!'));
}

function getUser(user) {
    result = [];
    for (let str of getTODO().filter((str) => (str.includes(';')))) {
        let i = 8;
        for (let j = 0; j < user.length; j++) {
            if (user[j].toLowerCase() === str[i].toLowerCase()) {
                i++;
            }
            else break;
        }
        if (i == 8 + user.length) {
            result.push(str);
        }
    }
    return result;
}

function sortByImportant() {
    return getTODO().sort(compareImportants);
}

function compareImportants(a , b) {
    return b.split('!').length - a.split('!').length;
}

function sortByUser() {
    return getTODO().sort(compareUsers);
}

function compareUsers(a, b) {
    let stringA = a.split(';');
    let stringB = b.split(';');
    if(stringA.length !== 1 && stringB.length !== 1) {
        let nameA = stringA[0].slice(8).toLowerCase();
        let nameB = stringB[0].slice(8).toLowerCase();
        return nameA.localeCompare(nameB);
    }
    else return stringB.length - stringA.length;
}

function sortByDate() {
    return getTODO().sort(compareDates);
}

function compareDates(a, b) {
    let stringA = a.split(';');
    let stringB = b.split(';');
    if (stringA.length !== 1 && stringB.length !== 1) {
        let dateA = stringA[1].split('-').join('');
        let dateB = stringB[1].split('-').join('');
        return dateB.localeCompare(dateA);
    }
    return stringB.length - stringA.length;
}

function processCommand(command) {
    let commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTODO());
            break;
        case 'important':
            console.log(getImportant());
            break;
        case 'user':
            console.log(getUser(commands[1]));
            break;
        case 'sort':
            switch(commands[1]) {
                case 'importance':
                    console.log(sortByImportant());
                    break;
                case 'user':
                    console.log(sortByUser());
                    break;
                case 'date':
                    console.log(sortByDate());
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
            break;
        case 'date':

            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
