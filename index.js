const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = FindComents();
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let parts = command.split(' ');
    switch (parts[0]) {
        case 'exit':
            process.exit(0);
        break;
        case 'show':
            console.log(comments);
        break;
        case 'important':
            console.log(GetImportant());
        break;
        case 'user':
            console.log( GetCommentsByNames(parts[1]));
        break;
        case 'sort':
            sortBlock(parts);
        break;
        case 'date':
            console.log(FindComents().filter(line => line.indexOf(';') != -1).filter(line => new Date(line.split(';')[1].trim()) > new Date(parts[1])));
        break;
        default:
            console.log('wrong command');
            break;
    }
}

function sortBlock(parts){
    switch (parts[1]){
        case 'user':
        let sor_use = GetCommentsByNames(parts[2]).concat(comments.filter(line => line.split(';')[0].replace('// TODO','').trim().toLowerCase() != parts[2].toLowerCase()))
        console.log(sor_use);
        break;
        case 'date':
        let ans = GetDate().concat(FindComents().filter(line => line.indexOf(';') === -1))
        console.log(ans);
        break;
        case 'importance':
           let sorted = GetImportant().concat(FindComents().filter(line => line.indexOf('!') === -1));
            console.log(sorted);
        break;
        default:
        console.log('wrong argument');
        break;
        }
}
function FindComents() {
    let lines = [];
    for (let file of files)
        lines.push(...file.split('\r\n'));
    const matches = [];
    for (let line of lines) {
        let search = line.indexOf('// TODO');
        if (line.indexOf('\'// TODO')==-1 && search != -1)        
            matches.push(line.substring(search));
    }
    return matches;
}

function GetImportant(){
    return FindComents().filter(line => line.indexOf('!') != -1);
}

function GetCommentsByNames(name){
    return comments.filter(line => line.split(';')[0].replace('// TODO','').trim().toLowerCase() === name.toLowerCase())
}

function GetDate(){
    let okToParse = FindComents().filter(line => line.indexOf(';') != -1);
    let dataSorted = okToParse.sort((line1,line2) => new Date(line2.split(';')[1].trim())- new Date(line1.split(';')[1].trim()));
    return dataSorted;
}
// TODO you can do it!
