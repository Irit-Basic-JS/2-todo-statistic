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

function showAfter(date) {
    return getTODO().filter(line => line.indexOf(';') != -1).filter(line => new Date(line.split(';')[1].trim()) > new Date(date));
}

function toTable(todoList) {
    let first = ['!'];
    let second = ['user'];
    let third = ['date'];
    let forth = ['comment'];
    let spaces = [1, 4, 10, 7];
    for( let line of todoList){
        line.indexOf('!') != -1 ? first.push('!') : first.push('');
        line.indexOf(';') != -1 ? second.push(line.split(';')[0].replace('// TODO','').trim()) : second.push('');
        let len = second[second.length - 1].length;
        if (len > 10) {
            second[second.length - 1] = second[second.length - 1].slice(0, 7)+'...';
            len = 10;
        }
        if (len > spaces[1])
            spaces[1] = len;
        line.indexOf(';') != -1 ? third.push(line.split(';')[1].trim()) : third.push('');
        line.indexOf(';') != -1 ? forth.push(line.split(';')[2].trim()) : forth.push(line.split('// TODO ')[1].trim());
        len = forth[forth.length - 1].length;
        if (len > 50) {
        forth[forth.length - 1] = forth[forth.length - 1].slice(0, 47)+'...';
        len = 50;
        }
        if (len > spaces[3])
            spaces[3] = len;
    }

    for(let i = 0; i < first.length; i++) {
        console.log(first[i].padEnd(spaces[0]) + '  |  '
        + second[i].padEnd(spaces[1]) + '  |  '
        + third[i].padEnd(spaces[2]) + '  |  '
        + forth[i].padEnd(spaces[3]));
        if (i == 0) console.log(''.padEnd(spaces[0] + spaces[1] + spaces[2] + spaces[3] + 15,'-'))
    }
}

function processCommand(command) {
    let commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(toTable(getTODO()));
            break;
        case 'important':
            console.log(toTable(getImportant()));
            break;
        case 'user':
            console.log(toTable(getUser(commands[1])));
            break;
        case 'sort':
            switch(commands[1]) {
                case 'importance':
                    console.log(toTable(sortByImportant()));
                    break;
                case 'user':
                    console.log(toTable(sortByUser()));
                    break;
                case 'date':
                    console.log(toTable(sortByDate()));
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
            break;
        case 'date':
            console.log(toTable(showAfter(commands[1])));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
