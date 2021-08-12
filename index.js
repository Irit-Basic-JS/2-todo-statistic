const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand (command) { 
    // Разбор команды
    let parametr = '';
    let i = command.indexOf(' ');
    if (i > -1) 
    {
        parametr = command.substring(i).trim();
        command = command.substring(0, i);
    }
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(Comment());
            break;
        case 'important':
            console.log(Comment().filter(elem => elem.includes('!')));
            break;
        case 'user':
            console.log(getUser(parametr));
            break;
        case 'sort':
            console.log(getSort(parametr))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function Comment () 
{
    let filesTODO = new Array();
    let temp = [];
    // Разбиваем каждый файл (элемент files) на строки и отбираем те, что содержат комментарии.
    // Результат добавляем в filesTODO
    files.forEach(element =>
    {
        temp = element.split('\r\n').filter(element => element.includes('// TODO '));
        // Очищаем комментарии — удаляем текст в строке до комментария и команду с TODO
        temp.forEach(elem =>
        {
            let i = elem.indexOf('// TODO ');
            if (i === 0) filesTODO.push(elem); 
            else if (elem[i - 1] !== '\'')  // Не берем строки с командами, содержащими TODO
                filesTODO.push(elem.substring(i));
        });
    });
    return filesTODO;
}

function getUser (parametr)
{
    let retArr = new Array();
    // Рассмотрим поочередно все комментарии TODO
    Comment().forEach (elem => 
    {
        // Разбиваем строку на три части: имя, дата и сам комментарий
        let s = elem.slice(8).split(';');
        // Если значения регистронезависимых имени пользователя и параметра совпадают
        // и пользователь не является безымянным
        if ((s[0].toLowerCase().trim() === parametr.toLowerCase()) && (s.length != 1))
            retArr.push(elem); // Добавляем результат к retArr
    });
    return retArr;
}

function getSort (parametr)
{
    let retArr = Comment();
    // Сортируем комментарии TODO
    retArr.sort(function(a, b)
    {
        if (parametr === 'importance') // По восклицательным знакам 
        {
            // Вычисляем количество воскл. знаков в каждом элементе
            let m = a.split('').filter(e => e == '!').length;
            let n = b.split('').filter(e => e == '!').length;
            // Сравниваем полученные количества
            if (n > m) return 1;
            if (n == m) return 0;
            if (n < m) return -1;
        }
        // Разбиваем каждую строку на три части: имя пользователя, дата и сам комментарий
        let p = a.slice(8).split(';');
        let q = b.slice(8).split(';');
        // Если одна из строк не содержит имени пользователя и дату
        if (p.length == 1 || q.length == 1) return 1;
        if (parametr === 'user') // По имени пользователя
        {
            // Вычисляем строки с регистронезависимыми именами
            let u = p[0].toLowerCase().trim();
            let v = q[0].toLowerCase().trim();
            // Сравниваем полученные строки
            if (u > v) return 1;
            if (u === v) return 0;
            if (u < v) return -1;
        }
        if (parametr === 'date') // По дате
        {
            // Вычисляем строки с датами
            let u = p[1].trim();
            let v = q[1].trim();
            // Сравниваем полученные строки
            if (v > u) return 1;
            if (v === u) return 0;
            if (v < u) return -1;
        }
    });
    return retArr;
}