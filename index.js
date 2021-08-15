const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('path');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    // Добавили имя файла в возвращаемый массив
    return filePaths.map(pathArr => [readFile(pathArr), path.basename(pathArr)]);
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
    switch (command)
    {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTab(getInf()));
            break;
        case 'important':
            console.log(getTab(getInf().filter(e => e[0] > 0)));
            break;
        case 'user':
            console.log(getTab(getUser(parametr)));
            break;
        case 'sort':
            console.log(getTab(getSort(parametr)));
            break;
        case 'date':
            console.log(getTab(getDate(parametr)));
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
        temp = element[0].split('\r\n').filter(element => element.includes('// TODO '));
        // Очищаем комментарии — удаляем текст в строке до комментария и команду с TODO
        temp.forEach(elem =>
        {
            let i = elem.indexOf('// TODO ');
            if (i === 0) filesTODO.push([elem, element[1]]); 
            else if (elem[i - 1] !== '\'')  // Не берем строки с командами, содержащими TODO
                filesTODO.push([elem.substring(i), element[1]]); // 0 - комментарий, 1 - имя файла
        });
    });
    return filesTODO; 
}

// ФИЛЬТР КОММЕНТАРИЕВ ПО УКАЗАННОМУ ИМЕНИ ПОЛЬЗОВАТЕЛЯ
function getUser (parametr)
{
    let retArr = new Array();
    getInf().forEach (e => 
    {
        if ((e[1].toLowerCase() === parametr.toLowerCase()))
            retArr.push(e);
    });
    return retArr;
}

// СОРТИРОВКА КОММЕНТАРИЕВ
function getSort (parametr)
{
    let retArr = getInf();
    retArr.sort(function(a, b)
    {
        if (parametr === 'importance') // По восклицательным знакам 
        {
            let m = a[0];
            let n = b[0];
            if (n > m) return 1;
            if (n == m) return 0;
            if (n < m) return -1;
        }
        if (parametr === 'user') // По имени пользователя
        {
            let u = a[1].toLowerCase();
            let v = b[1].toLowerCase();
            if ((u == '') || (v == '')) return 0;
            if (u > v) return 1;
            if (u === v) return 0;
            if (u < v) return -1;
        }
        if (parametr === 'date') // По дате
        {
            let u = a[2];
            let v = b[2];
            if (v > u) return 1;
            if (v === u) return 0;
            if (v < u) return -1;
        }
    });
    return retArr;
}

// ФИЛЬТР КОММЕНТАРИЕВ ПО УКАЗАННОЙ ДАТЕ
function getDate (parametr)
{
    let retArr = new Array();
    let p = parametr.split('-');
    getInf().forEach(e =>
    {
        if (e[2] != '') // Если не указана дата
        {
            let s = e[2].split('-');
            if (Number(p[0]) === Number(s[0])) // Сравниваем годы
            {
                if (p.length == 1)
                    retArr.push(e);
                else if (Number(p[1]) === Number(s[1])) // Сравниваем месяцы
                {
                    if (p.length == 2)
                        retArr.push(e);
                    else if (Number(p[2]) === Number(s[2])) // Сравниваем дни
                        retArr.push(e);
                }
            }
        }
    });
    return retArr;
}

// РАЗБИВКА КОММЕНТАРИЯ НА 5 ЧАСТЕЙ:
// кол-во воскл. знаков, имя пользователя, дата, сам комментарий, имя файла
function getInf ()
{
    let retArr = new Array();
    Comment().forEach(elem =>
    {
        // Получаем массив из имени пользователя, даты и комментария
        let s = elem[0].slice(8).split(';');
        // Добавляем к началу массива новый элемент — кол-во восклицательных знаков
        s.unshift(elem[0].split('').filter(e => e == '!').length);
        if (s.length == 2) // Если комментарий не включает имя пользователя и дату
        {
            s[4] = elem[1];
            s[3] = s[1].trim();
            s[1] = '';
            s[2] = '';
        }
        else
        {
            s[1] = s[1].trim(); // Имя пользователя
            s[2] = s[2].trim(); // Дата
            s[3] = s[3].trim(); // Комментарий
            s[4] = elem[1]; // Имя файла
        }
        retArr.push(s);
    });
    return retArr;
}

// ВЫВОД РЕЗУЛЬТАТОВ В КОНСОЛЬ В ВИДЕ ТАБЛИЦЫ
function getTab (arr)
{
    let retArr = '';
    let n = 4; // Размер самого длинного имени пользователя
    let c = 7; // Размер самого длинного комментария
    let f = 4; // Размер самого длинного имени файла
    arr.forEach (e =>
    {
        if (e[1].length > n) // Ищем самое длинное имя пользователя
        {
            if (e[1].length <= 10) // Если длина не больше макс. возможной
                n = e[1].length;
            else n = 10;
        }
        if (e[3].length > c) // Ищем самый длинный комментарий
        {
            if (e[3].length <= 50) // Если длина не больше макс. возможной
                c = e[3].length;
            else c = 50;
        }
        if (e[4].length > f) // Ищем самое длинное имя файла
            f = e[4].length;
    });
    // Добавляем в таблицу заголовое
    retArr += '\n!  |  user' + ' '.repeat(n - 4) + '  |  date' + ' '.repeat(6) + '  |  comment' + ' '.repeat(c - 7) + '  |  file';
    // Отделяем заголовое от остальной части таблицы
    retArr += '\n' + '-'.repeat(n + c + f + 31);
    // Заполняем таблицу
    arr.forEach (e =>
    {
        let s0; // 
        if (e[0] == 0)
            s0 = ' ';
        else s0 = '!';
        let s1; // Имя пользователя
        if (e[1].length <= 10)
            s1 = e[1] + ' '.repeat(n - e[1].length);
        else
            s1 = e[1].slice(0, 9) + '…';
        let s2 = e[2]; // Дата
        if (s2 == '')
            s2 += ' '.repeat(10);
        let s3; // Комментарий
        if (e[3].length <= 50)
            s3 = e[3] + ' '.repeat(c - e[3].length);
        else
            s3 = e[3].slice(0, 49) + '…';
        let s4 = e[4] + ' '.repeat(f - e[4].length); // Имя файла
        // Добавляем строку
        retArr += '\n' + s0 + '  |  ' + s1 + '  |  ' + s2 + '  |  ' + s3 + '  |  ' + s4;
    });
    retArr += '\n' + '-'.repeat(n + c + f + 31);
    return retArr;
}