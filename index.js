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
    let words = command.split(' ')
    switch (words[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(showTODOS());
            break;
        case 'important':
            console.log(showImportant());
            break;
        case 'user':
            console.log(showNames(words[1].toLowerCase()));
            break;
        case 'sort':
            switch (words[1]) {
                case 'importance':
                    console.log(sortImportance());
                    break;
                case 'user':
                    break;
                case 'date':

            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function parseLines() {
    let parsedFiles = [];
    let lines = [];
    for (let i = 0; i < files.length; i++) {
        parsedFiles.push(files[i].split("\r\n"));
        lines = lines.concat(parsedFiles[i]);
    }
    return lines;
}

function showTODOS() {
    let toDoLines = [];
    let lines = parseLines();
    lines.forEach(line => {let index = line.indexOf("// TODO")
        if (index !== -1 && line[index + 7] !== '"')
            toDoLines.push(line.slice(index))});
    return toDoLines;
}

function showNames(username) {
    let namedLines = [];
    let todos = showTODOS();
    todos.forEach(line => {if (line.toLowerCase().includes(username))
        namedLines.push(line.slice(line.indexOf("// TODO")).split(';')[2].replace(' ', ''))});
    return namedLines;
}

function showImportant() {
    let importantLines = [];
    let todos = showTODOS();
    todos.forEach(line => {if (line.includes("!")) importantLines.push(line)});
    return importantLines;
}

function sortImportance() {
    return showTODOS().sort((todo1, todo2) => todo2.split('!').length - todo1.split('!').length)
}

function sortUser() {
    return showTODOS().slice().sort((a, b) => {
        let firstName = a.split(' ').slice(2).join(' ');
        firstName = firstName.split(';')[0];
        let secondName = b.split(' ').slice(2).join(' ');
        secondName = secondName.split(';')[0];

        if(firstName === a.split(' ').slice(2).join(' ') || secondName === b.split(' ').slice(2).join(' '))
            return 1

        return firstName.length - secondName.length;
    })
}

// TODO you can do it!
