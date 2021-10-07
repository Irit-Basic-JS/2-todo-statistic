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
    let commands = command.split(" ");
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTasks());
            break;
        case 'important':
            console.log(getTasks().filter(elem => elem.includes('!')));
            break;
        case 'user':
            console.log(getTasksByUser(commands[1]));
            break;
        case 'sort':
            console.log(sortTasks(commands[1]))
            break;
        case 'date':
            console.log(getTasksByDate(commands[1]))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTasks () 
{
    let tasks = new Array();
    let temp = [];

    files.forEach(element =>
    {
        temp = element.split('\r\n').filter(element => element.includes('// TODO '));
        temp.forEach(elem =>
        {
            let i = elem.indexOf('// TODO ');
            if (i === 0) tasks.push(elem); 
            else if (elem[i - 1] !== '\'')
                tasks.push(elem.substring(i));
        });
    });
    return tasks;
}

function getTasksByUser (parameter)
{
    let tasks = new Array();
    getTasks().forEach (elem => 
    {
        let s = elem.slice(8).split(';');
        if ((s[0].toLowerCase().trim() === parameter.toLowerCase()) && (s.length != 1))
            tasks.push(elem);
    });
    return tasks;
}

function sortTasks (parameter)
{
    let sortedTasks = getTasks();
    sortedTasks.sort(function(a, b)
    {
        if (parameter === 'importance')
        {
            let m = a.split('').filter(e => e == '!').length;
            let n = b.split('').filter(e => e == '!').length;
            if (n > m) return 1;
            if (n == m) return 0;
            if (n < m) return -1;
        }
        let p = a.slice(8).split(';');
        let q = b.slice(8).split(';');
        if (p.length == 1 || q.length == 1) return 1;
        if (parameter === 'user')
        {
            let u = p[0].toLowerCase().trim();
            let v = q[0].toLowerCase().trim();
            if (u > v) return 1;
            if (u === v) return 0;
            if (u < v) return -1;
        }
        if (parameter === 'date')
        {
            let u = p[1].trim();
            let v = q[1].trim();
            if (v > u) return 1;
            if (v === u) return 0;
            if (v < u) return -1;
        }
    });
    return sortedTasks;
}

function getTasksByDate (parameter)
{
    let tasks = new Array();
    let date = [];
    date[0] = parameter;
    if(parameter.includes("-"))
        date = parameter.split('-');
    getTasks().forEach(elem =>
    {
        let taskParts = elem.slice(8).split(';');
        if (taskParts.length > 2)
        {
            if (taskParts[1] != '')
            {
                let s = taskParts[1].replace(" ", '').split('-');
                if (date[0] === s[0])
                {
                    if (date.length == 1)
                        tasks.push(elem);
                    else if (date[1] === s[1])
                    {
                        if (date.length == 2)
                            tasks.push(elem);
                        else if (date[2] === s[2])
                            tasks.push(elem);
                    }
                }
            }
        }
    });
    return tasks;
}
// TODO you can do it!