const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const startOfComment = "// TODO ";
const files = getFiles();
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
	let comments = [];
	for (const file of files) {
		let lines = file.split('\r\n');
		for (let line of lines) {
			let comment = getComment(line, startOfComment);
			if (comment) comments.push(comment);
		}
	}
	return comments;
}

function getComment(line, startOfComment) {
	let index = line.lastIndexOf(startOfComment);
	if (~index && !['"', "'", '`'].includes(line[index - 1]))
		return line.slice(index + startOfComment.length);
}

// TODO you can do it!
