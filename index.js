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
    let splitted = command.split(' ');
    switch (splitted[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(findAllToDo());
            break;
        case 'important':
            console.log(ImportantToDo());
            break;
        case 'user':
            console.log(userFind(splitted[1]));
            break;
        case 'sort':
            console.log(sortToDo(splitted[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findAllToDo() {
    let result = [];
    for(let e of files){
        let arr = e.split('\n');
        for(let line of arr)
            if(line.includes('// TODO') && !line.includes('\'// TODO\'')){
                let i = line.indexOf('// TODO');
                result.push(line.slice(i));
            }
    }
    return result;
}

function ImportantToDo() {
    let impArr = [];
    let arr = findAllToDo();
    for (line of arr)
        if(line.includes('!'))
            impArr.push(line);
    return impArr;
}

function userFind(user) {
    let arr = findAllToDo();
    user = user.toLowerCase();
    let resultArr = [];
    for (line of arr){
        let result = line;
        line = line.replace('// TODO', '').split(';');
        ourUser = line[0].split(' ').join('');
        if (user == ourUser.toLowerCase())
            resultArr.push(result);
    } 
    return resultArr;
}

function sortToDo(type){
    switch(type){
        case 'importance':
            return sortImportance();
        case 'user':
            return sortUser();
        case 'date':
            return sortDate();
        default:
            return 'wrong command';
    }
}

function sortImportance(){
    let arr = findAllToDo();
    arr.sort(function(a, b) {
        return b.split("!").length - a.split("!").length;
    });
    return arr;
}
function sortUser() {
    let arr = findAllToDo();
    let userArr = [];
    for (line of arr){
        let result = line;
        line = line.replace('// TODO', '').split(';');
        line.length >= 3 ? userArr.unshift(result) : userArr.push(result);
    }
    return userArr;
}

function sortDate() {
    let arr = findAllToDo();    
    arr.sort(function(a, b) {
        a = a.replace('// TODO', '').split(';');
        b = b.replace('// TODO', '').split(';');
        if (a.length >= 3 && b.length >= 3){
        a = a[1].split(' ').join('').split('-').join('');
        b = b[1].split(' ').join('').split('-').join('');
        return b - a;
        }
    });
    return arr;
}

// TODO you ! ! !can do it



// TODO bazdaun; 2016-11-08; тестик!!!!!!!!!!!!!!! 
