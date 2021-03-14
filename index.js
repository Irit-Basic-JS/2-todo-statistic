const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
//console.log(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let split = command.split(" ");
    // let [c,...args] = split;
    //if (comans[c])
    //  comans[c](...args);
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
                case 'user':
                    console.log(sortUser());
                case 'data':
                    console.log(sortData());

            }

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
        if (i.includes('!')) {
            result.push(i);
        }
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
        let difference = b.split(';').length - a.split(';').length;
        if (difference !== 0) {
            return difference;
            return a.split(';')[0].localeCompare(b.split(';'));
        }
    })
}function sortData() {
    return show().sort((a, b) => {
        let aData = a.split('; ');
        let bData = b.split('; ');
        if (aData.length === 3) {
            if (aData[1] > bData[1])
                return -1
            if (aData[1] < bData[1])
                return 1
            return 0;
        }
        else if (bData.length === 1) {
            return -1;
        }
        return 1;
})}

//comans =
//{exit: () => process.exit(0),
//  show,
//important,
//}
//ODO you can do it!
/*function processCommand(comans) {
    let [instruction, ...args] = command.split(" ");
    if (commands[instruction])
        console.log(getWithNewFormat(commands[instruction](files, ...args)));
    else
        console.log('wrong command');
}*/



