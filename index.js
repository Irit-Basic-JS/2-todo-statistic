const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
let get = getFiles()
const files = get[0];
const inFile = get[1];
let allToDo = getTODOs()[0];
let allFileToDo = getTODOs()[1];
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    let inFile = [];
    return [filePaths.map(path => {
        inFile.push(path)
        return readFile(path);
    }), inFile];
}

function getTODOs(){
    let inFiles = [];
    let allToDo = [];
    for (let file of files){
        let f = file.split('\r');
        for (let str of f){
            if (str.includes(('// todo ').toUpperCase())){
                allToDo.push(str.slice(str.indexOf(('// todo ').toUpperCase())));
                inFiles.push(inFile.filter(path => readFile(path).includes(allToDo[allToDo.length-1]))[0].split('/')[1]);
            }
        }
    }
    let toDos = [];
    for (let item of allToDo){
        item = item.split(';');
        if (item.length === 3){
            toDos.push({
                important: item.join(';')[-1] === '!'
                    ? item.join(';').split('!').length
                    : item.join(';').split('!').length - 1,
                user: item[0].slice(8),
                date: item[1].trim(),
                comment: item[2],
                toDo: item.join(';')
            });
        }
        else {
            toDos.push({
                important: item.join(';')[-1] === '!'
                    ? item.join(';').split('!').length
                    : item.join(';').split('!').length - 1,
                user: undefined,
                date: undefined,
                comment: item[0].split(' ').slice(2).join(' '),
                toDo: item.join(';')
            })
        }
    }
    return [toDos, inFiles];
}

function processCommand(command){
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printTable(allToDo);
            break;
        case 'important':
            printTable(important());
            break;
        case 'user':
            printTable(getUserTODO(command[1]));
            break;
        case 'sort':
            switch (command[1]){
                case 'importance':
                    printTable(sortImportance());
                    break;
                case 'user':
                    printTable(sortUser());
                    break;
                case 'date':
                    printTable(sortDate())
                    break;
            }
            break;
        case 'date':
            printTable(getDate(command[1]))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function important(){
    return allToDo.filter(item => item.important > 0);
}

function getUserTODO(user){
    return allToDo.filter(item => {
        if (item.user === undefined) return false
        else return item.user.toLowerCase() === user;
    });
}

function sortImportance(){
    return important().concat((allToDo.filter(item => item.important === 0)));
}

function sortUser(){
    let user = allToDo.filter(item => item.user !== undefined);
    let noUser = allToDo.filter(item => item.user === undefined);
    return user.concat(noUser);
}

function sortDate(){
    let date = allToDo.filter(item => item.date !== undefined).sort((x, y) => Date.parse(y.date) - Date.parse(x.date));
    let noDate = allToDo.filter(item => item.date === undefined);
    return date.concat(noDate);
}

function getDate(day){
    return  allToDo.filter(item => item.date !== undefined).filter(item => Date.parse(item.date) > Date.parse(day));
}

function printTable(data){
    let length = getLength(data);
    let title = getTitle(length);
    console.log(title);
    console.log('-'.repeat(title.length))
    for (let item of data){
        console.log(`${item.important > 0 
                    ? '!' 
                    : ' '}  |  ${item.user === undefined 
                        ? ' '.repeat(length[1])
                        : item.user.length > length[1] 
                        ? item.user.slice(0, 7) + '...'
                        : item.user + (' '.repeat(length[1] - item.user.length))}  |  ${item.date === undefined 
                                            ? ' '.repeat(length[2])
                                            : item.date}  |  ${ item.comment.length > length[3]
                                                    ? item.comment.slice(0, 47) + '...' 
                                                    : item.comment + 
                                                    ' '.repeat(length[3] - item.comment.length)}  |  ${allFileToDo[allToDo.indexOf(item)] + ' '.repeat(length[4] - allFileToDo[allToDo.indexOf(item)].length)}  |`);
    }
    console.log('-'.repeat(title.length));
}

function getTitle(length){
    let user = ' '.repeat((length[1] - 4) / 2) + 'user' + ' '.repeat((length[1] - 4) / 2);
    let date = ' '.repeat((length[2] - 4) / 2) + 'date' + ' '.repeat((length[2] - 4) / 2);
    let comment = ' '.repeat((length[3] - 7) / 2) + 'comment' + ' '.repeat((length[3] - 7) / 2 + 1);
    let file = ' '.repeat((length[4] - 4) / 2) + 'file' + ' '.repeat((length[4] - 4) / 2 + 1);
    return `   |  ${user}  |  ${date}  |  ${comment}  |  ${file}  |`
}

function getLength(data){
    let length = [1];
    let usersLength = data.map(item => item.user === undefined ? 0 : item.user.length).sort((x, y) => y - x)[0];
    let commentsLength = data.map(item => item.comment.length).sort((x, y) => y - x)[0];
    let filesLength = allFileToDo.map(item => item.length).sort((x, y) => y - x)[0];
    length.push(usersLength > 10 ? 10 : usersLength);
    length.push(10);
    length.push(commentsLength > 50 ? 50 : commentsLength);
    length.push(filesLength);
    return length;
}
// TODO you can do it!
