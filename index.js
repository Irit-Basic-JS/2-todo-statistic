const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const allTodo = getTODO();

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
            console.log(allTodo);
            break;
        case 'important':
            console.log(important());
            break;
        case 'user':
            console.log(user());
            break;
        default:
        console.log('wrong command');
        break;
    }
}

function getTODO(){
    let result = [];
        for(let file of files) {
            let strings = file.split('\r\n').filter(x => x.includes('// TODO') && !x.includes('\'// TODO\''));
        for(let str of strings) {
            result.push(str.slice(str.indexOf('//')));
        }
    }
    return result;
}

function important(){
let important = [];

    for (let e of allTodo){
        if (e.includes('!')){
        important.push(e);
        }
    }
    return important;
}



function user(){
    let user = "PE";
    let ss = [];
    let rr = allTodo.map(x => x.split(';'));
    result1 = [];
    
    for(let i = 0; i < allTodo.length; i++){
        ss.push(rr[i][0].substring(8).toUpperCase());
        if (user === ss[i])
            result1.push(allTodo[i]);
    }
    
        return console.log(result1);
}

// TODO you can do it!