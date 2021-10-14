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
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(findTODO().map(x=>x.full));
            break;
        case 'important':
            console.log(findTODO().map(x=>x.full).filter(x => x.includes('!')));
            break;
        case 'user':
            console.log(findTODO().map(x=>x.full).filter(x => x.toLowerCase().includes(command[1].toLowerCase()+';')));
            break;
        case 'sort':
            console.log(SortTODO(command[1]).map(x=>x.full))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findTODO(){
    allComments=[]
    for (let file of files){
        allLines = file.split('\r\n').filter(x => (x.includes('// TODO ')) & !(x.includes('\'// TODO \'')));
        for (let line of allLines){
            let parsedLine = line.substring(line.indexOf('// TODO ')+'// TODO '.length).split('; ');
            let allInfo = {
                inside:parsedLine[2]||parsedLine[0],
                date: Date.parse(parsedLine[1]),
                user: parsedLine[0],
                full: line.substring(line.indexOf('// TODO ')),
                importance: line.split('!').length
            }
            allComments.push(allInfo);
        }
    }
    return allComments
}

function SortTODO(comType){
    switch (comType){
        case 'importance':
            return findTODO().sort((x, y) => +(y.importance) - +(x.importance));
        case 'user':
            return findTODO().sort((x, y) => x.user.localeCompare(y.user))
        case 'date':
            return findTODO().sort((x, y) => +(y.date) - +(x.date));
        default:
            console.log('wrong command');
            return;
    }
}
// TODO you can do it!
