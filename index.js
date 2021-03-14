const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const startOfComment = "// TODO ";
const files = getFiles();
console.log(files.length);
const comments = getComments(files);
console.log(comments);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
	return filePaths.map(path => readFile(path));
}

function processCommand(command) {
	switch (command) {
		case 'exit':
			process.exit(0);
			break;
		default:
			console.log('wrong command');
			break;
	}
}

function getComments(files) {
	return files.map(file => file.split('\r\n')
		.map(line => getComment(line, startOfComment))
		.filter(line => line))
	.flat(1);
}

function getComment(line, startOfComment) {
	let index = line.lastIndexOf(startOfComment);
	if (~index && !['"', "'", '`'].includes(line[index - 1]))
		return line.slice(index + startOfComment.length);
}

// TODO you can do it!
