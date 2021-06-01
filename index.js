const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const comments = getComments(getFiles());

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
	return filePaths.map(currentPath => {
		return {file: readFile(currentPath), path: currentPath}
	});
}

function processCommand(command) {
	let processedComments;
	if (command === 'exit')
		process.exit(0);
	else if (command === 'show')
		processedComments = comments;
	else if (command === 'important')
		processedComments = exclamation(comments);
	else if (command === 'sort importance')
		processedComments = exclamationSort(comments);
	else if (command === 'sort user')
		processedComments = userSort(comments);
	else if (command === 'sort date')
		processedComments = dateSort(comments);
	else {
		let split = command.split(' ');
		if (split[0] === 'date')
			processedComments = date(comments, split[1]);
		else if (split[0] === 'user')
			processedComments = user(comments, split[1]);
		else
			console.log('wrong command');
	}
	if (processedComments !== undefined) show(processedComments);
}

function getComments(files) {
	let comments = [];
	for (let file of files) {
		for (let line of file.file.split('\r\n')) {
			let comment = getComment(line, file.path);
			if (comment) comments.push(comment);
		}
	}

	return comments;
}

function getComment(line, path) {
	let position = line.lastIndexOf("// TODO ");
	if (position !== -1 && line[position - 1] !== '"') {
		let comment = line.slice(position + 8);

		let components = comment.split(';', 3).map(line => line.trim());
		let exclamation = 0;
		for (let char of comment) {
			if (char === '!') exclamation++;
		}

		let file = path.slice(path.lastIndexOf("/") + 1);
		if (components.length === 3)
			return {
				exclamation: exclamation,
				name: components[0],
				date: new Date(components[1]),
				comment: components[2],
				file: file
			};
		else {
			return {
				exclamation: exclamation,
				comment: comment,
				file: file
			};
		}
	}
}

function user(comments, userName) {
	return comments.filter(comment => comment.name && comment.name.toLowerCase() === userName.toLowerCase());
}

function exclamation(comments) {
	return comments.filter(comment => comment.exclamation !== 0);
}

function date(comments, date) {
	return comments.filter(comment => comment.date && comment.date - new Date(date) >= 0);
}

function dateSort(comments) {
	let noDateComments = comments.filter(comment => !comment.date);
	let dateComments = comments.filter(comment => comment.date).sort((a, b) => (b.date - a.date));
	return dateComments.concat(noDateComments);
}

function userSort(comments) {
	let noNameComments = comments.filter(comment => !comment.name);
	let nameComments = comments
	.filter(comment => comment.name).sort((a, b) => (a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
	return nameComments.concat(noNameComments);
}

function exclamationSort(comments) {
	return comments.sort((a, b) => b.exclamation - a.exclamation);
}

function show(comments) {
	let sizes = getSizes(comments);
	console.log(getTitle(sizes));
	console.log(getSeparator(sizes));
	for (let comment of comments) {
		console.log(getLine(comment, sizes));
	}
}

function getSizes(comments) {
	let sizes = {exclamation: 1, name: 9, date: 10, comment: 7, file: 9};
	for (let comment of comments) {
		if (comment.name?.length > sizes.name) sizes.name = comment.name.length;
		if (comment.comment.length > sizes.comment) sizes.comment = comment.comment.length;
		if (comment.file.length > sizes.file) sizes.file = comment.file.length;
	}
	if (sizes.name > 10) sizes.name = 10;
	if (sizes.comment > 50) sizes.comment = 50;
	if (sizes.file > 20) sizes.file = 20;
	return sizes;
}

function getLine(comment, sizes) {
	return [
		comment.exclamation !== 0 ? '!' : ' ',
		processValue(comment.name, sizes.name),
		processValue(comment.date, sizes.date),
		processValue(comment.comment, sizes.comment),
		processValue(comment.file, sizes.file)
	].join(' | ');
}

function processValue(value, maxSize) {
	if (!value) return ' '.repeat(maxSize);
	if (value instanceof Date)
		return Intl.DateTimeFormat('ru').format(value).replace(/\./g, '-');
	if (value.length && value.length > maxSize) return value.slice(0, maxSize - 1) + '…';
	return value.padEnd(maxSize);
}

function getTitle(sizes) {
	return getLine({
		exclamation: '!',
		name: 'name',
		date: 'date',
		comment: 'comment',
		file: 'file name'
	}, sizes);
}

function getSeparator(sizes) {
	let length = 3 * 4;
	for (let size of Object.values(sizes)) {
		length += size;
	}
	return '-'.repeat(length);
}

// TODO you can do it!
