const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const startOfComment = "// TODO ";
const filesAndPath = getFilesAndPath();
const commentsInfo = getCommentsInfo(filesAndPath);

console.log('Please, write your command!');
readLine(processCommand);

function getFilesAndPath() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
	return filePaths.map(currentPath => {
		return {file: readFile(currentPath), path: currentPath}
	});
}

function getCommentsInfo(filesAndPath) {
	return filesAndPath.map(fileAndPath => fileAndPath.file.split('\r\n')
		.map(line => getCommentInfo(line, startOfComment, fileAndPath.path))
		.filter(line => line))
	.flat(1);
}

function getCommentInfo(line, startOfComment, path) {
	let index = line.lastIndexOf(startOfComment);
	if (~index && !['"', "'", '`'].includes(line[index - 1])) {
		let comment = line.slice(index + startOfComment.length);
		let important = (comment.match(/!/gm) || []).length;
		let split = comment.split(';', 3).map(line => line.trim());
		let fileName = path.slice(path.lastIndexOf("/") + 1);
		return (split.length === 3)
			? {important, name: split[0], dateOfCreation: new Date(split[1]), comment: split[2], fileName}
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
			result = commands.show(commentsInfo);
			break;
		case 'important':
			result = commands.important(commentsInfo);
			break;
		case 'sort importance':
			result = commands.sortImportance(commentsInfo);
			break;
		case 'sort user':
			result = commands.sortUser(commentsInfo);
			break;
		case 'sort date':
			result = commands.sortDate(commentsInfo);
			break;
		default:
			let split = command.split(' ');
			if (split[0] === 'user')
				result = commands.user(commentsInfo, split[1]);
			else if (split[0] === 'date')
				result = commands.date(commentsInfo, split[1]);
			else
				console.log('wrong command');
			break;
	}

	console.log();
	if (result) tableParser(result);
}

function tableParser(data) {
	let tableSize = getTableSize(data);
	createSeparatorLine(tableSize);
	createTitle(tableSize);
	createSeparatorLine(tableSize);
	data.forEach(record => console.log(getLine(record, tableSize)));
	createSeparatorLine(tableSize);
}

function getLine(record, tableSize) {
	let prefix = '  | ';
	let ending = '  |';
	let root = [
		record.important ? '!' : ' ',
		getCell(record.name, tableSize.name),
		getCell(record.dateOfCreation, tableSize.dateOfCreation),
		getCell(record.comment, tableSize.comment),
		getCell(record.fileName, tableSize.fileName)
	].join(' | ');

	return `${prefix}${root}${ending}`;
}

function getCell(property, maxLength) {
	if (!property) return ' '.repeat(maxLength);
	if (property instanceof Date)
		return Intl.DateTimeFormat('ru').format(property).replace(/\./g, '-');
	if (property?.length > maxLength) return property.slice(0, maxLength - 1) + '…';
	return property.padEnd(maxLength);
}

function getTableSize(data) {
	let tableSize = {important: 1, name: 9, dateOfCreation: 10, comment: 7, fileName: 9};

	for (const record of data) {
		if (record.name?.length > tableSize.name)
			tableSize.name = record.name.length;
		if (record.comment.length > tableSize.comment)
			tableSize.comment = record.comment.length;
		if (record.fileName.length > tableSize.fileName)
			tableSize.fileName = record.fileName.length;
	}

	if (tableSize.name > 10) tableSize.name = 10;
	if (tableSize.comment > 50) tableSize.comment = 50;
	if (tableSize.fileName > 20) tableSize.fileName = 20;

	return tableSize;
}

function createTitle(tableSize) {
	console.log(getLine(
		{important: 1, name: 'name', dateOfCreation: 'date', comment: 'comment', fileName: 'file name'},
		tableSize));
}

function createSeparatorLine(tableSize) {
	let prefix = '  ';
	let count = tableSize.important + tableSize.name + tableSize.dateOfCreation
		+ tableSize.comment + tableSize.fileName + 4 * 3 + 5;
	console.log(prefix + '-'.repeat(count));
}

// TODO you can do it!
