const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

let allToDo = getTODOs();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODOs(){
    let allToDo = [];
    for (let file of files){
        file = file.split('\r');
        for (str of file){
            if (str.includes(('// todo ').toUpperCase()))
                allToDo.push(str.slice(str.indexOf(('// todo ').toUpperCase())));
        }
    }
    let toDos = [];
    for (let item of allToDo){
        item = item.split(';');
        if (item.length === 3){
            toDos.push({
                user: item[0].slice(8),
                date: Date.parse(item[1].trim()),
                comment: item[2],
                toDo: item.join(';')
            });
        }
        else {
            toDos.push({
                user: undefined,
                date: undefined,
                comment: item.join(';'),
                toDo: item.join(';')
            })
        }
    }
    return toDos;
}

function processCommand(command){
    command = command.split(' ');
    switch (command[0]) {
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
            console.log(getUserTODO(command[1]));
            break;
        case 'sort':
            switch (command[1]){
                case 'importance':
                    console.log(sortImportance());
                    break;
                case 'user':
                    console.log(sortUser());
                    break;
                case 'date':
                    console.log(sortDate())
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show(){
    return allToDo.map(item => item.toDo);
}

function important(){
    return allToDo.filter(item => item.comment.includes('!')).map(item => item.toDo);
}

function getUserTODO(user){
    return allToDo.filter(item => {
        if (item.user === undefined) return false
        else return item.user.toLowerCase() === user;
    }).map(item => item.toDo);
}

function sortImportance(){
    return important().concat((allToDo.filter(item => !item.comment.includes('!'))).map(item => item.toDo));
}

function sortUser(){
    let user = allToDo.filter(item => item.user !== undefined);
    let noUser = allToDo.filter(item => item.user === undefined);
    return user.concat(noUser).map(item => item.toDo);
}
function sortDate(){
    let date = allToDo.filter(item => item.date !== undefined).sort((x, y) => y.date - x.date );
    let noDate = allToDo.filter(item => item.date === undefined);
    return date.concat(noDate).map(item => item.toDo);
}


// TODO you can do it!
