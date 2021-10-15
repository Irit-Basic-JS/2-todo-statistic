const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const files = getFiles();

console.log('Please, write your command!');

readLine(processCommand);

function getFiles()
{
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) 
{
    let option = command.split(' ');
    switch (option[0]) 
    {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTab(toShow()));
            break;
        case 'important':
            console.log(getTab(getImportant()));
            break;
        case 'user':
            console.log(getTab(getComments(option[1])));
            break;
        case 'sort':
            switch (option[1]) {
                case 'importance':
                    console.log(getTab(sortImportance()));
                    break;
                case 'user':
                    console.log(getTab(sortUser()));
                    break;
                case 'date':
                    console.log(getTab(sortDate()));
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
            break;
        case 'date':
            console.log(getTab(date(option[1])));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toShow() 
{
    let res = [];
    files.map(code => code.split("\r\n")
        .filter(line => line.includes("// TODO ") && !line.includes("\"// TODO \"")))
        .forEach(t => t.forEach(line => res.push(line.split("// TODO ")[1])));
    return res;
}

function getImportant() 
{
    return toShow().filter(line => line.endsWith("!"));
}

function getComments(userName) 
{
    return toShow().filter(line => line.toLowerCase().startsWith(`${userName.toLowerCase()};`));
}

function sortImportance() 
{
    return toShow().sort((a, b) => b.split("!").length - a.split("!").length);
}

function sortUser() 
{
    return toShow().sort((a, b) => {
        let nameA=a.toLowerCase(), nameB=b.toLowerCase()
        if (a.split(";").length !== 1) 
        {
            if (nameA < nameB)
                return -1
            if (nameA > nameB)
                return 1
            return 0;
        } 
        
        else if (b.split(";").length === 1) 
            return -1;
        else 
            return 0;
    });
}

function sortDate() 
{
    return toShow().sort((a, b) => {
        let aInfo = a.split("; "), bInfo = b.split("; ");
        if (aInfo.length === 3) 
        {
            if (aInfo[1] > bInfo[1])
                return -1;
            return aInfo[1] < bInfo[1] ? 1 : 0;
        } 
        
        else 
            return bInfo.length === 1 ? -1 : 0;
    });
}

function date(value) 
{
    return toShow().filter(a => {
        let aInfo = a.split("; ");
        if (aInfo.length === 3) 
            return (aInfo[1] > value);
        return false;
    });
}

function truncateString (str, len) 
{
    let strSlice = str.slice(0, len);
    return strSlice === str ? str + ' '.repeat(len - str.length) : strSlice.slice(0, len-3) + "...";
}

function getTab(value) 
{
    const sep = "  |  ";
    let userMax = 4;  
    let dateMax = 4; 
    let commentMax = 7; 
    value.forEach(line => 
        {
        const lineInfo = line.split("; ");
        if (lineInfo.length === 3) 
        {
            userMax = Math.max(userMax, lineInfo[0].length);
            dateMax = Math.max(dateMax, lineInfo[1].length);
            commentMax = Math.max(commentMax, lineInfo[2].length);
        } 

        else 
        {
            commentMax = Math.max(commentMax, lineInfo[0].length);
        }
    });

    userMax = Math.min(userMax, 10);
    commentMax = Math.min(commentMax, 50);
    let res = value.map(line => 
        {
        const lineInfo = line.split("; ");
        if (lineInfo.length === 3) 
        {
            const important = lineInfo[2].endsWith("!") ? '!' : ' ';
            lineInfo[0] = truncateString(lineInfo[0], userMax);
            lineInfo[2] = truncateString(lineInfo[2], commentMax);
            return important + sep + lineInfo.join(sep);
        } 

        else 
        {
            const important = lineInfo[0].endsWith("!") ? '!' : ' ';
            lineInfo[0] = truncateString(lineInfo[0], commentMax);
            return important + sep + ' '.repeat(userMax) + sep + ' '.repeat(10) + sep + lineInfo[0];
        }
    });
    let titleUser = truncateString("user", userMax);
    let titleDate = truncateString("date", dateMax);
    let titleComment = truncateString("comment", commentMax);
    const title = "!" + sep + titleUser + sep + titleDate + sep + titleComment;
    const titleLine = '-'.repeat(title.length);
    res.unshift(title, titleLine);
    res.push(titleLine);
    return res;
}

// TODO you can do it!
// TODO lalalala
// TODO do re mi fa sol lya si