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
			? {important: important, name: split[0], dateOfCreation: new Date(split[1]), comment: split[2]}
			: {important: important, comment: comment};
	}
}

const commands = new function () {
	this.show = comments => comments;

	this.important = comments => comments.filter(comment => comment.important !== 0);

	this.user = (comments, userName) =>
		comments.filter(comment => comment.name && comment.name.toLowerCase() === userName.toLowerCase());

	this.date = (comments, date) =>
		comments.filter(comment => comment.dateOfCreation && comment.dateOfCreation - new Date(date) >= 0);

	this.sortImportance = comments => comments.sort((a, b) => b.important - a.important);

	this.sortUser = function (comments) {
		let commentsWithName = comments.filter(comment => comment.name)
			.sort((a, b) => (a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
		let commentsWithoutName = comments.filter(comment => !comment.name);
		return commentsWithName.concat(commentsWithoutName);
	}

	this.sortDate = function (comments) {
		let commentsWithDate = comments.filter(comment => comment.dateOfCreation)
			.sort((a, b) => (b.dateOfCreation - a.dateOfCreation));
		let commentsWithoutDate = comments.filter(comment => !comment.dateOfCreation);
		return commentsWithDate.concat(commentsWithoutDate);
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
				result = commands.date(comments, split[1]);
			else
				console.log('wrong command');
			break;
	}

	console.log();
	if (result) tableParser(result);
}

function tableParser(data) {
	let nameAndMessageSize = getNameAndCommentSize(data);
	createSeparatorLine(nameAndMessageSize);
	createTitle(nameAndMessageSize);
	createSeparatorLine(nameAndMessageSize);
	data.forEach(record => console.log(getLine(record, nameAndMessageSize)));
	createSeparatorLine(nameAndMessageSize);
}

function getLine(record, nameAndMessageSize) {
	let paragraph = '  ';
	return paragraph + [
		record.important ? '!' : ' ',
		getCell(record.name, nameAndMessageSize[0]),
		getCell(record.dateOfCreation, 10),
		getCell(record.comment, nameAndMessageSize[1])
	].join(' | ');
}

function getCell(property, maxLength) {
	if (!property) return ' '.repeat(maxLength);
	if (property instanceof Date)
		return Intl.DateTimeFormat('ru').format(property).replace(/\./g, '-');
	if (property.length > maxLength) return property.slice(0, maxLength - 3) + '...';
	return property.padEnd(maxLength);
}

function getNameAndCommentSize(data) {
	let columnSize = [0, 10];
	for (const record of data) {
		if (record.name && record.name.length > columnSize[0])
			columnSize[0] = record.name.length;
		if (record.comment && record.comment.length > columnSize[1])
			columnSize[1] = record.comment.length;
	}
	if (columnSize[0] > 10) columnSize[0] = 10;
	if (columnSize[0] < 4) columnSize[0] = 4;
	if (columnSize[1] > 50) columnSize[1] = 50;
	if (columnSize[1] < 7) columnSize[1] = 7;

	return columnSize;
}

function createTitle(nameAndMessageSize) {
	console.log(getLine(
		{important: 1, name: 'name', dateOfCreation: 'date', comment: 'comment'},
		nameAndMessageSize));
}

function createSeparatorLine(nameAndMessageSize) {
	let count = nameAndMessageSize[0] + nameAndMessageSize[1] + 10 + 3 + 3 * 3;
	console.log('-'.repeat(count));
}

// TODO you can do it!
