const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO = allTODO();
const important = importantTODO();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commandSort = command.split(' ');
    switch (commandSort[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(TODO)
            break;
        case 'important':
            console.log(important)
            break
        case 'user':
            console.log(nameTODO(commandSort[1]))
            break
        case 'sort':
            switch (commandSort[1]) {
                case 'importance':
                    console.log()
                    break;
                case 'user':
                    console.log(sortUser())
                    break;
                case 'date':
                    console.log()
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
    }
}

function allTODO(){
    let res = []
    for(let file of files){
        let list = file.split('\r\n').filter(word => word.includes('// TODO') && !word.includes('\'// TODO\''))
        for(let string of list){
            res.push(string.slice(string.indexOf('//')))
        }
    }
    return res
}

function importantTODO(){
    let res = []
    for(let str of TODO){
        if(str.includes('!')){
            res.push(str)
        }
    }
    return res
}

function nameTODO(name) {
    const res = []
    name = name.toLowerCase();
    for(let str of TODO){
        if((str.split(';').length === 3) && (str.toLowerCase().startsWith(name, 8))){
            res.push(str)
        }
    }
    return res
}

function sortUser(){
    const res =[]
    for(let str of TODO){
        if((str.split(';').length === 3)){
            res.push(str)
        }
    }

    for(let str1 of TODO){
        if(str1.split(';').length !== 3){
            res.push(str1)
        }
    }
    return res
}
// TODO you can do it!
