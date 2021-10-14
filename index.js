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
    let split = command.split(" ");
    switch (split[0]) {
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
                console.log(user(split[1]));
                break;
            case 'sort':
                switch (split[1]){
                    case 'importance':
                        console.log(sortImportance());
                        break;
                    case 'user':
                        console.log(sortUser());
                        break;
                    case 'data':
                        console.log(sortData());
                        break;
                }
                break;
        case 'date':
            console.log(date(split[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show() {
    let res = [];
    files.map(code => code.split("\r\n")
        .filter(line => line.includes("// TODO ") && !line.includes("\"// TODO \"")))
        .forEach(t => t.forEach(line => res.push(line.split("// TODO ")[1])));
    return res;
}

function important() {
    let str = show();
    let result = [];
    for (let i of str) {
        if (i.includes('!')) result.push(i);
    }
    return result;
}

function user(username) {
    return show().filter(str => str.toLowerCase().startsWith(`${username.toLowerCase()};`));

}

function sortImportance() {
    return show().sort((a, b) => b.split('!').length - a.split('!').length);
}

function sortUser() {
    return show().sort((a, b) => {
        let aUser = a.toLowerCase().split(';');
        let bUser = b.toLowerCase().split(';');
        if (aUser.length !== 1) {
            if (aUser > bUser) return 1;
            if (aUser < bUser) return -1;
            return 0;
        }
        else if (bUser.length === 1)  return -1;
        return 0;
    });
}

function sortData() {
    return show().sort((a, b) => {
        let aData = a.split('; ');
        let bData = b.split('; ');
        if (aData.length === 3) {
            if (aData[1] > bData[1]) return -1
            if (aData[1] < bData[1]) return 1
            return 0;
        }
        else if (bData.length === 1) return -1;
        return 1;
})}

function date(data){
    return show().filter(a => {
           let splinDate = a.split('; ')
           if(splinDate.length === 3) return splinDate[1] > data;
           return false;
        });
}
// TODO you can do it!
// не переживай
// переживешь
