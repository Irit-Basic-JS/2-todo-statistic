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
			? {name: split[0], data: new Date(split[1]), message: split[2], important: important, comment: comment}
			: {comment: comment, important: important};
	}
}

function processCommand(command) {
	let result;
	switch (command) {
		case 'exit':
			process.exit(0);
			break;
		case 'show':
			result = commands.show(comments);
			break;
		case 'important':
			result = commands.important(comments);
			break;
		case 'sort importance':
			result = commands.sortImportance(comments);
			break;
		case 'sort user':
			result = commands.sortUser(comments);
			break;
		case 'sort date':
			result = commands.sortDate(comments);
			break;

		default:
			let split = command.split(' ');
			if (split[0] === 'user')
				result = commands.user(comments, split[1]);
			else if (split[0] === 'date')
				result = command.date(comments, split[1]);
			else
				console.log('wrong command');
			break;
	}
	result.forEach(comment => console.log(comment.comment));
}

const commands = new function () {
	this.show = comments => comments;

	this.important = comments => comments.filter(comment => comment.important !== 0);

	this.user = (comments, userName) =>
		comments.filter(comment => comment.name && comment.name.toLowerCase() === userName.toLowerCase());

	this.date = (comments, date) => comments.filter(comment => comment.data && comment.data - new Date(date) >= 0);

	this.sortImportance = comments => comments.sort((a, b) => b.important - a.important);

	this.sortUser = function (comments) {
		let commentsWithName = comments.filter(comment => comment.name)
		.sort((a, b) => (a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
		let commentsWithoutName = comments.filter(comment => !comment.name);
		return commentsWithName.concat(commentsWithoutName);
	}

	this.sortDate = function (comments) {
		let commentsWithDate = comments.filter(comment => comment.data)
		.sort((a, b) => (b.data - a.data));
		let commentsWithoutDate = comments.filter(comment => !comment.data);
		return commentsWithDate.concat(commentsWithoutDate);
	}
}

// TODO you can do it!
