const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { count } = require('console');
 
const files = getFiles();
 
console.log('Please, write your command!');
readLine(processCommand);
 
function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
};
 
function processCommand(command) {
    let commands = command.split(" ");
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(toShow());
            break;
        case 'important':
            console.log(important());
            break;
        case 'user': 
            console.log(user(commands[1]));
            break;
        case 'sort':
            switch (commands[1]){
                case 'importance':
                    console.log(sortImportance());
                    break;
                case 'user':
                    console.log(sortUser());
                    case 'date':
                        console.log(sortDate());
                    break;
            };
        case 'date':
            console.log(doDate(commands[1]));
            break;
        default:
        console.log('wrong command');
        break;
    }
};
 
function toShow(){
    let lines = [];
    for (let file of files)
        lines.push(...file.split('\r\n'));
    lines = lines.flat(Infinity);
    const matches = [];
    for (let line of lines) {
        let search = line.indexOf(`// TODO`);
        if (search != -1)
 
            matches.push(line.substring(search));
    }
    return matches;
};

function important(){
    let importantLines = [];
    for (let line of toShow()){
        if (line.includes('!')){
            importantLines.push(line);
        }
    }
    return importantLines;
};

function user(name){
    return toShow().filter(line => line.toLowerCase().includes(name.toLowerCase()));
};

function sortImportance(){
    return toShow().sort((line1, line2) => line2.split('!').length - line1.split('!').length);
};

function sortUser() {
    return toShow().sort((x, y) => {
        let name1=x.toLowerCase(), name2=y.toLowerCase()
        if (x.split(";").length !== 1) {
            if (name1 < name2)
                return -1
            if (name1 > name2)
                return 1
            return 0;
        } else if (y.split(";").length === 1) {
            return -1;
        } else {
            return 0;
        }
    });
}

function sortDate() {
    return toShow().sort((x, y) => {
        let line1 = x.split('; '), line2 = y.split('; ');
        if (line1.length === 3) {
            if (line1[1] > line2[1])
                return -1;
            if (line1[1] < line2[1])
                return 1;
            return 0;
        } 
        else if (line2.length === 1) {
            return -1;
        } 
        else {
            return 0;
        }
    });
}   
    
function doDate(date1){
    let res =[];
    let inputDate=date1.split('-');
    listDates= toShow().filter(line=> line.split('; ').length>=2);
    for(let line of listDates){
        let flag = true;
        lineDate= line.split('; ')[1].split('-');
        for(let i=0;i<inputDate.length;i++){
            if(inputDate[i]>lineDate[i]){
                flag=false;
            }
        }
        if(flag) {
            res.push(line);
        }
    }
    return res;
};

// TODO you can do it!
 