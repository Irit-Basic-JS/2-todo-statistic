const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    let result = {};

    filePaths.forEach(path => {
        result[path] = readFile(path)
    });
    return result;
}

function showTODOs(data, filterFunc) {
    let content = [];
    data.forEach(todo => {
        if (filterFunc(todo))
            content.push(getTODOdata(todo));
    });

    let headers = ["!", "user", "date", "comment", "path"];
    printTable(headers, content);
}

function getTODOdata(todo) {
    let raw = Object.values(todo);
    raw.forEach((e, index) => {
        if (e === undefined)
            raw[index] = "";
        else {
            if (index == 2)
                raw[index] = (new Date(raw[index])).toISOString().split('T')[0];
            raw[index] = String(raw[index])
        }
    });

    return raw;
}

function printTable(headers, data) {

    let maxWidthArr = getMaxWidthArr(data.concat([[...headers]]));
    console.log(
        getHeaders(headers, maxWidthArr)
        + "\n"
        + getData(data, maxWidthArr)
    );

    function getHeaders(headers, maxWidthArr) {
        let row = getRow(headers, maxWidthArr);
        return row + '\n'
        + `${'-'.repeat(row.length)}`;
    }

    function getMaxWidthArr(allData, limit = 30) {
        let maxWidthArr = Array(allData[0].length).fill(0);

        allData.forEach(row => {
            for (let i = 0; i < row.length; ++i) {
                maxWidthArr[i] = Math.max(maxWidthArr[i], row[i].length);
                maxWidthArr[i] = Math.min(maxWidthArr[i], limit);
            }
        });

        return maxWidthArr;
    }

    function getData(table, maxWidthArr) {
        let strings = [];

        table.forEach(row => {
            strings.push(getRow(row, maxWidthArr));
            strings.push(getRow(Array(row.length).fill(""), maxWidthArr));
        });

        return strings.join("\n")
    }

    function getRow(textArr, maxWidthArr) {
        let cells = [];
        let limit = Math.max(...maxWidthArr);
        textArr.forEach((text, index) => {
            let cell = getCell(text.substring(0, limit), maxWidthArr[index])
            cells.push(cell);
        });

        let result = cells.join("|");

        const overlength = (e) => e.length > limit;

        if (textArr.some(overlength)) {
                result += "\n";
                let secondLevelText = [];
                textArr.forEach(text => {
                    if (overlength(text))
                        secondLevelText.push(text.substring(limit, text.length));
                    else
                        secondLevelText.push("")
                });

                result += getRow(secondLevelText, maxWidthArr);
            }
        
        return result
    }

    function getCell(text, width) {
        return `  ${text}${' '.repeat(width - text.length)}  `;
    }
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
        showTODOs(data, (e) => true);    
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
            showTODOs(preProcessData, (todo) => true);
            break;
            
        case 'important':
            showTODOs(preProcessData, (todo) => todo.importance > 0)
            break;

        case 'user':
            if (params.length == 1) {
                showTODOs(preProcessData, (todo) => 
                todo.user != undefined && (params[0].toLowerCase() == todo.user.toLowerCase()))
            }
            else
                console.log('wrong params');
            break;

        case 'date':
            if (params.length == 1) {
                let date = Date.parse(params[0]);
                showTODOs(preProcessData, (todo) => todo.date >= date)
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
    let result = {importance: 0, user: undefined, date: undefined, message: undefined};

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
    result.message = split[split.length - 1].trim();
    return result;
}

function preProcessTODOS(texts)
{
    let result = [];
    Object.keys(texts).forEach(key => {
        getTODOs(texts[key]).forEach(todo => {
            let parsed = parseTODO(todo);
            parsed.path = key;
            result.push(parsed);
        });
    });

    return result;
}

//console.log(preProcessTODOS(getFiles()));
//processCommand("show")