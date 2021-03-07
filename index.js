const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const commands = {
    exit: () => process.exit(0),
    show (text) {
        let lines = text.map(t => t.split("\r\n")
            .filter(line => line.includes("// TODO ") && !line.includes("\"// TODO \"")));
        let res = [];
        lines.forEach(t => t.forEach(line => res.push(line.split("// TODO ")[1])));
        return res;
    },
    important(files) {
        return this.show(files).filter(line => line.includes("!")).filter(x => x.length > 0);
    },
    user (files, name) {
        name = name.toLowerCase();
        return this.show(files)
            .filter(line => line.slice(0, line.indexOf(";")).toLowerCase() === name);
    },
    sort: function (files, orderBy) {
        const sortingOptions = {
            importance(value) {
                value.sort((a, b) => b.split("!").length - a.split("!").length);
                // неэффективно по памяти, но элегантно
            },
            user (value) {
                value.sort((a, b) => b.split(";").length - a.split(";").length);
                //Добавить алфавитную сортировку ?
            },
            data (value) {
                value.sort((a, b) => { //Это не я, тут индус постарался
                    let bSplit = b.split(';');
                    let aSplit = a.split(';');
                    if (bSplit.length === 3 && aSplit.length === 3) {
                        return new Date(aSplit[1]) > new Date(bSplit[1]) ? -1 : 1;
                    } else if (bSplit.length === 3) {
                        return 1;
                    } else if (aSplit.length === 3) {
                        return 1;
                    }

                    return 0;
                });
            }
        };

        let res = this.show(files);
        if (orderBy in sortingOptions)
            sortingOptions[orderBy](res);
        return res;
    }
};

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let split = command.split(" ");
    if (split[0] in commands)
        console.log(commands[split[0]](files, split[1]));
    else
        console.log('wrong command');
}


// TODO you can do it!
// TODO your soul is mine!
// TODO relax !!!!!!!!!!!
// TODO play with the code !!!
