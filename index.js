const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const startOfComment = "// TODO ";
const filesAndPath = getFilesAndPath();
const comments = getComments(filesAndPath);

console.log('Please, write your command!');
readLine(processCommand);

function getFilesAndPath() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
	return filePaths.map(currentPath => {
		return {file: readFile(currentPath), path: currentPath}
	});
}

function getComments(filesAndPath) {
	return filesAndPath.map(fileAndPath => fileAndPath.file.split('\r\n')
		.map(line => getComment(line, startOfComment, fileAndPath.path))
		.filter(line => line))
	.flat(1);
}

function getComment(line, startOfComment, path) {
	let index = line.lastIndexOf(startOfComment);
	if (~index && !['"', "'", '`'].includes(line[index - 1])) {
		let comment = line.slice(index + startOfComment.length);
		let important = (comment.match(/!/gm) || []).length;
		let split = comment.split(';', 3).map(line => line.trim());
		let fileName = path.slice(path.lastIndexOf("/") + 1);
		return (split.length === 3)
			? {important, name: split[0], dateOfCreation: new Date(split[1]), comment: split[2], fileName: fileName}
			: {important, comment, fileName};
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
	let tableSizes = getTableSizes(data);
	createSeparatorLine(tableSizes);
	createTitle(tableSizes);
	createSeparatorLine(tableSizes);
	data.forEach(record => console.log(getLine(record, tableSizes)));
	createSeparatorLine(tableSizes);
}

function getLine(record, tableSizes) {
	let paragraph = '  | ';
	let indentation = '  |';
	return paragraph + [
		record.important ? '!' : ' ',
		getCell(record.name, tableSizes[1]),
		getCell(record.dateOfCreation, tableSizes[2]),
		getCell(record.comment, tableSizes[3]),
		getCell(record.fileName, tableSizes[4])
	].join(' | ') + indentation;
}

function getCell(property, maxLength) {
	if (!property) return ' '.repeat(maxLength);
	if (property instanceof Date)
		return Intl.DateTimeFormat('ru').format(property).replace(/\./g, '-');
	if (property.length > maxLength) return property.slice(0, maxLength - 3) + '...';
	return property.padEnd(maxLength);
}

function getTableSizes(data) {
	let columnSize = [1, 9, 10, 7, 4];
	for (const record of data) {
		if (record.name && record.name.length > columnSize[1])
			columnSize[1] = record.name.length;
		if (record.comment && record.comment.length > columnSize[3])
			columnSize[3] = record.comment.length;
		if (record.fileName && record.fileName.length > columnSize[4])
			columnSize[4] = record.fileName.length;
	}
	if (columnSize[1] > 10) columnSize[1] = 10;
	if (columnSize[3] > 50) columnSize[3] = 50;
	if (columnSize[4] > 20) columnSize[4] = 20;

	return columnSize;
}

function createTitle(tableSizes) {
	console.log(getLine(
		{important: 1, name: 'name', dateOfCreation: 'date', comment: 'comment', fileName: 'file name'},
		tableSizes));
}

function createSeparatorLine(tableSizes) {
	let paragraph = '  ';
	let count = tableSizes.reduce((sum, current) => sum + current, 0) + 3 * 4 + 5;
	console.log(paragraph + '-'.repeat(count));
}

// TODO you can do it!
