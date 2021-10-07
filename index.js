const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function showTODOs(data, important = false, user = undefined) {
    data.forEach(todo => {
        if ((user == undefined || (todo.user != undefined && (user.toLowerCase() == todo.user.toLowerCase())))
            && (!important || todo.importance))
            console.log(todo.raw);
    });
}

function sortTODOs(data, param)
{
    let sortFunc = undefined;
    switch (param) {
        case 'date':
            sortFunc = (a, b) => b.date - a.date;
            break;
        case 'importance':
            sortFunc = (a, b) => b.importance - a.importance;
            break;
        case 'user':
            sortFunc = (a, b) => a.user == undefined || b.user == undefined ? a.user - b.user : a.user.localeCompare(b.user);
            break;
        default:
            console.log('wrong params');
            break;
    }
    if (sortFunc != undefined) {
        data.sort(sortFunc);
        showTODOs(data);    
    }
}

function processCommand(input) {
    let preProcessData = preProcessTODOS(getFiles());
    let fullCommand = input.split(" ");
    let command = fullCommand[0];
    let params = [];
    
    if (fullCommand.length > 1)
        params = fullCommand.slice(1, fullCommand.length)

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTODOs(preProcessData);
            break;
        case 'important':
            showTODOs(preProcessData, true)
            break;
        case 'user':
            if (params.length == 1) {
                showTODOs(preProcessData, true, params[0])
            }
            else
                console.log('wrong params');
            break;
        case 'sort':
            if (params.length == 1) {
                sortTODOs(preProcessData, params[0]);
            }
            else
                console.log('wrong params');
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function hasParam(params, expected) {
    let result = false;
    params.forEach(param => {
        result = result || param == expected;
    });
    return result;
}
  

function getTODOs(text) {
    let result = [];
    let index = 0;
    while(index != -1 && index < text.length) {
        let end = -1;
        index = text.indexOf("// TODO", index);
        if (index != -1) {
            //убираем упоминания "// TODO" (в ковычках)
            if (text[index-1] != `"`
                || text[index+"// TODO".length] != `"`) {
                    end = text.indexOf(`\n`, index);
                    if (end == -1)
                        end = text.length - 1;
        
                    result.push(text.substring(index,end));
                }
            index++;
        }
    }

    return result;
}

function parseTODO(todo) {
    let result = {raw: todo, user: undefined, date: undefined};

    let split = todo.split(';');

    if (split.length > 1) {
        result.user = split[0].substring (
            split[0].indexOf("// TODO") + "// TODO".length, split[0].length
        )
        .replace(/\s/g, '');
        if (result.user == "")
            result.user = undefined;
    }

    if (split.length > 2) {
        result.date = Date.parse(
            split[1].substring(0, split[0].length+1).replace(/\s/g, ''));
    }

    result.importance = (todo.match(/!/g) || []).length;
    return result;
}

function preProcessTODOS(texts)
{
    let result = [];
    texts.forEach(text => {
        getTODOs(text).forEach(todo => {
            result.push(parseTODO(todo));
        });
    });

    return result;
}

//console.log(preProcessTODOS(getFiles()));
//processCommand("sort importance")