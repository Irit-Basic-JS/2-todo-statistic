const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const commands = {
    exit: () => process.exit(0),
    show,
    important,
    user,
    sort: sortOptions,
    data,
};

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let [instruction, ...args] = command.split(" ");
    if (commands[instruction])
        console.log(getWithNewFormat(commands[instruction](files, ...args)));
    else
        console.log('wrong command');
}

// TODO you can do it!
// TODO your soul is mine!
// TODO relax !!!!
// TODO play with the code !!!

//Все функции для задачи ниже

function show(text) {
    let lines = text.map(t => t.split("\r\n")
        .filter(line => line.includes("// TODO ") && !line.includes("\"// TODO \"")));
    let res = [];
    lines.forEach(t => t.forEach(line => res.push(line.split("// TODO ")[1])));
    return res;
}

function important(files) {
    return this.show(files).filter(line => line.includes("!")).filter(x => x.length > 0);
}

function user(files, name) {
    name = name.toLowerCase();
    return this.show(files)
        .filter(line => line.slice(0, line.indexOf(";")).toLowerCase() === name);
}

function sortOptions(files, orderBy) {
    const sortingOptions = {
        importance(value) {
            value.sort((a, b) => b.split("!").length - a.split("!").length);
            // неэффективно по памяти, но быстро и элегантно
        },
        user: function (value) {
            value.sort((a, b) => {
                let bSplit = b.split(';');
                let aSplit = a.split(';');
                let count = bSplit.length - aSplit.length;
                if (count !== 0)
                    return count;
                return aSplit[0].localeCompare(bSplit[0]);
            });
        },
        data(value) {
            value.sort((a, b) => { //Это не я, тут индус постарался
                let bSplit = b.split(';');
                let aSplit = a.split(';');
                let count = bSplit.length - aSplit.length;
                if (count !== 0)
                    return count;
                return new Date(aSplit[1]) > new Date(bSplit[1]) ? -1 : 1; // в идеале ноль придусмотреть, но говнокод
            });
        }
    };

    let res = this.show(files);
    if (sortingOptions[orderBy])
        sortingOptions[orderBy](res);
    return res;
}

function data(files, dateTime) {
    dateTime = new Date(dateTime);
    return this.show(files).filter(line => {
        let split = line.split(";");
        return split.length === 3 && new Date(split[1]) > dateTime;
    });
}

function getWithNewFormat(array, maxName = 10, maxData = 10, maxInstruction = 50) {
    // Спорный метод
    let params = findMaxLengthParams(array);
    maxName = params[0] < maxName ? params[0] : maxName;
    maxData = params[1] < maxData ? params[1] : maxData;
    maxInstruction = params[2] < maxInstruction ? params[2] : maxInstruction;
    const dividingLine = "_".repeat(maxName + maxData + maxInstruction + 16);
    const firstSecondRow = [`!  |  ${"user".padEnd(maxName)}  |  ${"data".padEnd(maxData)}  |  ${"comment".padEnd(maxInstruction)}`,
        dividingLine];
    let result = firstSecondRow.concat(array.map(line => {
        let res = line.includes("!") ? "!  |  " : "   |  ";
        let split = line.split(";");
        if (split.length === 3) {
            res += truncateString(split[0].padEnd(maxName), maxName) + "  |  " +
                truncateString(split[1].replace(" ", "").padEnd(maxData), maxData) + "  |  " +
                truncateString(split[2].padEnd(maxInstruction), maxInstruction);
        } else {
            res += `${" ".repeat(maxName)}  |  ${" ".repeat(maxData)}  |   ${split[0].padEnd(maxInstruction - 1)}`; //ПРОБЕЛ
        }

        return res;
    }));
    result.push(dividingLine);
    return result;
}

//Вспомогательные функции

function findMaxLengthParams(array) {
    let maxName = 0;
    let maxData = 0;
    let maxInstruction = 0;
    for (const i of array) {
        const split = i.split(";");
        if (split.length !== 3)
            continue;
        if (split[0].length > maxName)
            maxName = split[0].length;
        if (split[1].length > maxName)
            maxData = split[1].length;
        if (split[2].length > maxName)
            maxInstruction = split[2].length;
    }

    return [maxName, maxData, maxInstruction];
}

function truncateString(str, len) {
    if (str.length > len)
        return str.slice(0, len - 1) + "…";
    return str;
}












