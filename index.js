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
            console.log(doHeader(toShow()));
            break;
        case 'important':
            console.log(doHeader(important()));
            break;
        case 'user': 
            console.log(doHeader(user(commands[1])));
            break;
        case 'sort':
            switch (commands[1]){
                case 'importance':
                    console.log(doHeader(sortImportance()));
                    break;
                case 'user':
                    console.log(sortUser());
                    case 'date':
                        console.log(doHeader(sortDate()));
                    break;
            };
        case 'date':
            console.log(doHeader(doDate(commands[1])));
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
    return doTable(matches);
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
        if (x.split("|").length !== 1) {
            if (name1 < name2)
                return -1
            if (name1 > name2)
                return 1
            return 0;
        } else if (y.split("|").length === 1) {
            return -1;
        } else {
            return 0;
        }
    });
}

function sortDate() {
    return toShow().sort((x, y) => {
        let line1 = x.split('|'), line2 = y.split('|');
        if (line1[2].includes('-')&& line2[2].includes('-')) {
            if (line1[2] > line2[2])
                return -1;
            if (line1[2] < line2[2])
                return 1;
            return 0;
        } 
        else if (line2[2].indexOf('-')==-1) {
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
    listDates= toShow().filter(line=> line.split('|').length>=2);
    for(let line of listDates){
        let flag = true;
        lineDate= line.split(' | ')[2].split('-');
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

function doTable(lines){
    let res=[];
    for (let line of lines){
        let strArr =[];
        let lineSplit = line.split(';');
        if(line.includes('!'))
            strArr.push('!');
        else strArr.push(' ');
        if (lineSplit.length!=3){
            let a=' ';
            strArr.push(a.padEnd(10,' '));
            strArr.push(a.padEnd(11,' '));
            strArr.push(lineSplit[0].split('TODO')[1].substring(0,50).padEnd(50,' '))
        }
        if (lineSplit.length==3){
       
        strArr.push(lineSplit[0].split('TODO')[1].substring(0,10).padEnd(10,' '));
        strArr.push(lineSplit[1].padEnd(10,' '));
        strArr.push(lineSplit[2].substring(0,50).padEnd(50,' '));
        }

        res.push(strArr.join(' |'));
    }
    return res;
}

function doHeader(lines){
    let res = ['!','user'.padEnd(10,' '),' date '.padEnd(11,' '),'comment'.padEnd(50,' ')].join(' |');
    let line = ''.padEnd(res.length,'-');
    lines.unshift(line);
    lines.push(line);
    lines.unshift(res);
    return lines;
}

// TODO you can do it!
 