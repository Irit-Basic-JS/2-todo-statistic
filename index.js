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
            TablePrint(comments);
        break;
        case 'important':
            TablePrint(GetImportant());
        break;
        case 'user':
            TablePrint( GetCommentsByNames(parts[1]));
        break;
        case 'sort':
            sortBlock(parts);
        break;
        case 'date':
            TablePrint(FindComents().filter(line => line.indexOf(';') != -1).filter(line => new Date(line.split(';')[1].trim()) > new Date(parts[1])));
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
        TablePrint(sor_use);
        break;
        case 'date':
        let ans = GetDate().concat(FindComents().filter(line => line.indexOf(';') === -1))
        TablePrint(ans);
        break;
        case 'importance':
           let sorted = GetImportant().concat(FindComents().filter(line => line.indexOf('!') === -1));
           TablePrint(sorted);
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

function TablePrint(mas){                         // TODO ya; ;
    let first = ['!'];
    let second = ['user'];
    let third = ['date'];
    let forth = ['comment'];
    let spaces = [1,4,10,7];
    for( let line of mas){
        line.indexOf('!') != -1 ? first.push('!') : first.push('');
        line.indexOf(';') != -1 ? second.push(line.split(';')[0].replace('// TODO','').trim()) : second.push('');
        let len = second[second.length - 1].length;
        if(len>10){
            second[second.length - 1] = second[second.length - 1].slice(0,7)+'...';
        len=10;}
        if(len>spaces[1])
            spaces[1] = len;
        line.indexOf(';') != -1 ? third.push(line.split(';')[1].trim()) : third.push('');
        line.indexOf(';') != -1 ? forth.push(line.split(';')[2].trim()) : forth.push(line.split('// TODO ')[1].trim());
        len = forth[forth.length - 1].length;
        if(len>50){
        forth[forth.length - 1] = forth[forth.length - 1].slice(0,47)+'...';
        len = 50;
    }
        if(len>spaces[3])
            spaces[3] = len;
    }
    console.log(first[0].padEnd(spaces[0])+'  |  '+second[0].padEnd(spaces[1])+'  |  '+third[0].padEnd(spaces[2])+'  |  '+forth[0].padEnd(spaces[3]));
    console.log(''.padEnd(spaces[0]+spaces[1]+spaces[2]+spaces[3]+15,'-'))
    for(let i=1; i<first.length;i++)
    console.log(first[i].padEnd(spaces[0])+'  |  '+second[i].padEnd(spaces[1])+'  |  '+third[i].padEnd(spaces[2])+'  |  '+forth[i].padEnd(spaces[3]));
}
// TODO you can do it!
