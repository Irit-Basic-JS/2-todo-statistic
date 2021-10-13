const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { type } = require('os');

const files = getFiles();

const allComments = [];
findComments();

console.log('Please, write your command!');
readLine(processCommand);
// processCommand('sort date');

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {    
    let refCommand = command.split(' ');
    let dataCommand = refCommand.slice(1, refCommand.length).join(' ');

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(allComments);
            break;
        case 'important':
            console.log(findImportantComments());
            break;            
        case `user ${dataCommand}`:            
            let userComments = findUserComments(dataCommand.toLowerCase());
            console.log(userComments);
            break;
        case `sort ${dataCommand}`:
            let orderedComments = sortComments(dataCommand.toLowerCase());
            console.log(orderedComments);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findComments() {
    let lines = files.toString().split('\r\n');
    for(let e of lines) {        
        let index = e.indexOf('// TODO ');
        if(index != -1 && e.substring(index).length > 11) {
            allComments.push(e.substring(index));
        }
    }

    return allComments;
}

function findImportantComments() {
    let importantComments = [];
    for(let e of allComments) {
        index = e.indexOf('!');
        if(index != -1) {
            importantComments.push(e);
        }
    }

    return importantComments;
}

function findUserComments(username) {
    let name = username.toString().split(' ');
    let result = [];

    for(let e of allComments) {
        let index = 0;
        let elements = e.toLowerCase().replace(';', ' ').split(' ');
        if(name.length > 1) {            
            index = elements.indexOf(name[0]);
            if(index <= -1) index = -1000;
            if(index > -1) index = elements.indexOf(name[1]);
        } else {
            index = elements.indexOf(username);
        }
        if(index > -1) {
            result.push(e);
        }
    }

    return result;
}

function sortComments(filter) {
    switch(filter) {
        case 'importance':
            return allComments.slice().sort((a, b) => {// !, !!! not !!!, !
                let firstA = a.indexOf('!');
                let lastA = a.lastIndexOf('!');
                // let firstB = b.indexOf('!');
                // let lastB = b.lastIndexOf('!');
                if(firstA == lastA && firstA == -1) return 1;                
                return firstA == lastA ? -1 : firstA - lastA - 1;
            })
        case 'user':
            return allComments.slice().sort((a, b) => {
                let nameA = a.split(' ').slice(2).join(' ');
                nameA = nameA.split(';')[0];
                let nameB = b.split(' ').slice(2).join(' ');
                nameB = nameB.split(';')[0];

                if(nameA == a.split(' ').slice(2).join(' ') || nameB == b.split(' ').slice(2).join(' '))
                    return 1

                return nameA.length - nameB.length;
            })
        case 'date':
            return allComments.slice().sort((a, b) => {
                a = a.split(' ').slice(2).join(' ');
                a = a.split(';');
                b = b.split(' ').slice(2).join(' ');
                b = b.split(';');
                
                try {                    
                    let dateA = new Date(a[1]);
                    let dateB = new Date(b[1]);                    
                    return dateA.getTime() > dateB.getTime() ? -1 : dateA.getTime() === dateB.getTime() ? 0 : 1;
                } catch { }
                
            })
    }
}


// TODO you can do it!
