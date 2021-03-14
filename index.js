const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const startOfComment = "// TODO ";
const files = getFiles();
const comments = getComments(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
	return filePaths.map(path => readFile(path));
}

function getComments(files) {
	return files.map(file => file.split('\r\n')
	.map(line => getComment(line, startOfComment))
	.filter(line => line))
	.flat(1);
}

function getComment(line, startOfComment) {
	let index = line.lastIndexOf(startOfComment);
	if (~index && !['"', "'", '`'].includes(line[index - 1])) {
		let comment = line.slice(index + startOfComment.length);
		let important = (comment.match(/!/gm) || []).length;
		let split = comment.split(';', 3).map(line => line.trim());
		return (split.length === 3)
			? {name: split[0], date: new Date(split[1]), message: split[2], comment: comment, important: important}
			: {comment: comment, important: important};
	}
}

function processCommand(command) {
	switch (command) {
		case 'exit':
			process.exit(0);
			break;
		case 'show':
			commands.show(comments);
			break;
		case 'important':
			commands.important(comments);
			break;
		default:
			console.log('wrong command');
			break;
	}
}

const commands = new function () {
	this.show = comments => comments;

	this.important = comments => comments.filter(comment => comment.important !== 0);

	this.user = (comments, userName) =>
		comments.filter(comment => comment.name && comment.name.toLowerCase() === userName.toLowerCase());

	this.sortImportance = comments => comments.sort((a, b) => b.important - a.important);

	this.sortUser = function (comments) {
		let commentsWithName = comments.filter(comment => comment.name)
			.sort((a, b) => (a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
		let commentsWithoutName = comments.filter(comment => !comment.name);
		return commentsWithName.concat(commentsWithoutName);
	}

	this.sortDate = function (comments) {
		let commentsWithDate = comments.filter(comment => comment.date)
			.sort((a, b) => (b.date - a.date));
		let commentsWithoutDate = comments.filter(comment => !comment.date);
		return commentsWithDate.concat(commentsWithoutDate);
	}
}

// TODO you can do it!
