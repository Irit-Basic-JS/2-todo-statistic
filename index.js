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
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printTable(collectTODO());
            break;
        case 'important':
            printTable(collectTODO().filter(x => x.importance));
            break;
        case 'user':
            printTable(collectTODO()
                .filter(x => x.user.toLowerCase() === (commands[1].toLowerCase())));
            break;
        case 'sort':
            printTable(sortByParam(commands[1], collectTODO()));
            break;
        case 'date':
            let date = commands[1];
            date += date[4] != '-' ? '-12' : '';
            date += date[7] != '-' ? '-31' : '';
            printTable(sortByParam('date', collectTODO().filter(x => x.date > date)));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function collectTODO() {
    let result = [];
    files.map(file => file.split('\r\n'))
         .map(file => file.filter(line => line.includes('// TODO ') && !line.includes('\'// TODO'))
                    .map(line => result.push(parseTODO(line.split('// TODO ')[1].split(';')))));
    return result;
}

function parseTODO(todo) {
    let obj = {};
    obj.user = todo.length === 1 ? '' : todo[0].trim();
    obj.date = todo.length === 1 ? '' : todo[1].trim();
    obj.comment = todo.length === 1 ? todo[0].trim() : todo[2].trim();
    obj.importance = (!obj.comment.includes('!')) 
                        ? 0 : (obj.comment.lastIndexOf('!') - obj.comment.indexOf('!') + 1);
    return obj;
}

function sortByParam(param, todo) {
    switch (param) {
        case 'importance':
            return todo.sort((a, b) => b.importance - a.importance);
            break;
        case 'date':
            return todo.sort((a, b) => a.date > b.date || !a.date ? 1 : -1);
            break;
        case 'user':
            return todo.sort((a, b) => a.user.toLowerCase() > b.user.toLowerCase() || !a.user ? 1 : -1);
            break;
    }
}

function printTable(todo){
    let userColumnWeight = 4;
    let dateColumnWeight = 4;
    let commentColumnWeight = 7;
    for (let element of todo) {
        if (userColumnWeight < element.user.length) userColumnWeight = element.user.length;
        if (dateColumnWeight < element.date.length) dateColumnWeight = element.date.length;
        if (commentColumnWeight < element.comment.length) commentColumnWeight = element.comment.length;
    }
    if (userColumnWeight > 10) userColumnWeight = 10;
    if (commentColumnWeight > 50) commentColumnWeight = 50;
    console.log('  !  |  ' + 'user'.padEnd(userColumnWeight) + '  |  ' + 'date'.padEnd(dateColumnWeight) + '  |  ' + 'comment'.padEnd(commentColumnWeight));
    console.log('-'.repeat(20 + userColumnWeight + dateColumnWeight + commentColumnWeight));
    todo.map(x => 
        console.log('  ' + (x.importance ? '!' : ' ') + '  |  ' + 
                    (x.user.length > 10 ? x.user.slice(0, 7).padEnd(10, '.') : x.user.padEnd(userColumnWeight)) + '  |  ' + 
                    (x.date.padEnd(dateColumnWeight)) + '  |  ' + 
                    (x.comment.length > 50 ? x.comment.slice(0, 47).padEnd(50, '.') : x.comment.padEnd(commentColumnWeight))));
    console.log('-'.repeat(20 + userColumnWeight + dateColumnWeight + commentColumnWeight));
}
// TODO you can do it!