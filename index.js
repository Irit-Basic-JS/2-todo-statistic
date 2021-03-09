const {getAllFilePathsWithExtension, readFile} = require("./fileSystem");
const {readLine} = require("./console");
const pattern = /\/\/ TODO(([\w\s\d]+);)?\s?((\d{0,4}-\d{0,2}-\d{0,2});)?\s?(.+)?/gi;

const files = getFiles();
const comments = parseAllCommentsFromFiles(files);

console.log("Please, write your command!");
readLine(processCommand);

function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
	return filePaths.map(path => readFile(path));
}


function processCommand(command) {
	const commands = command.split(" ");
	switch (commands[0].trim()) {
		case "exit":
			process.exit(0);
			break;
		case "show":
			console.log(comments.map(x => x.value));
			break;
		case "important":
			console.log(comments
			.filter(x => x.importance !== 0)
			.map(x => x.value));
			break;
		case "user":
			let name = commands[1].toLowerCase();
			console.log(comments
			.filter(x => x.name === name)
			.map(x => x.value));
			break;
		case "sort":
			let parameter = commands[1];
			console.log(getSortedCommentsByParameter(parameter, comments).map(x => x.value));
			break;
		default:
			console.log("wrong command");
			break;
	}
}

function parseAllCommentsFromFiles(files) {
	const result = [];
	for (const file of files) {
		const matches = file.matchAll(pattern);
		for (const match of matches) {
			if (match) {
				result.push({
					value: match[0],
					name: match[2]?.toLowerCase(),
					date: Date.parse(match[4]),
					comment: match[5],
					importance: count(match[5], "!"),
				});
			}
		}
	}
	return result;
}

function count(str, symbol) {
	let count = 0;
	for (const s of str) {
		if (s === symbol)
			count++;
	}
	return count;
}

function getSortedCommentsByParameter(parameter, comments) {
	switch (parameter) {
		case "importance":
			return comments.sort(sortByImportance);
		case "user":
			return comments.sort(sortByName);
		case "date":
			return comments.sort(sortByDate);
	}
}

function sortByImportance(a, b) {
	if (b.importance < a.importance)
		return -1;
	else
		return 1;
}

function sortByName(a, b) {
	if (!a.name)
		return 1;
	if (a.name < b.name)
		return 1;
	return -1;
}

function sortByDate(a, b) {
	if (!a.date)
		return 1;
	if (a.date < b.date)
		return 1;
	return -1;
}


// TODO you can do it!
