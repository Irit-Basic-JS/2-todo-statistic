const path = require("path");

const {getAllFilePathsWithExtension, readFile} = require("./fileSystem");
const {readLine} = require("./console");
const pattern = /\/\/ TODO(([\w\s\d]+);)?\s?((\d{0,4}-\d{0,2}-\d{0,2});)?\s?(.+)?/gi;

const files = getFiles();
const comments = parseAllCommentsFromFiles(files);

console.log("Please, write your command!");
readLine(processCommand);

function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
	return filePaths.map(path1 => {
		return {
			file: readFile(path1),
			path: path.basename(path1),
		};
	});
}


function processCommand(command) {
	const commands = command.split(" ");
	switch (commands[0].trim()) {
		case "exit":
			process.exit(0);
			break;
		case "show":
			writeComments(comments);
			break;
		case "important":
			writeComments(comments
			.filter(x => x.importance !== 0));
			break;
		case "user":
			let name = commands[1].toLowerCase();
			writeComments(comments
			.filter(x => x.name === name));
			break;
		case "sort":
			let parameter = commands[1];
			writeComments(getSortedCommentsByParameter(parameter, comments));
			break;
		case "date":
			let date = new Date(commands[1]);
			writeComments(comments
			.filter(x => x.date > date));
			break;
		default:
			console.log("wrong command");
			break;
	}
}

function parseAllCommentsFromFiles(files) {
	const result = [];
	for (const file of files) {
		const matches = file.file.matchAll(pattern);
		for (const match of matches) {
			if (match) {
				result.push({
					value: match[0],
					name: match[2]?.trim().toLowerCase(),
					date: new Date(match[4]),
					comment: match[5].trim(),
					importance: count(match[5], "!"),
					path: file.path,
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
		return -1;
	return 1;
}

function sortByDate(a, b) {
	if (isNaN(a.date))
		return 1;
	if (a.date < b.date)
		return 1;
	return -1;
}


function writeComments(comments) {
	let header = decorateString({
		name: "name",
		date: undefined,
		comment: "comment",
		importance: 1,
		path: "path",
	});
	console.log(header);
	console.log("-".repeat(header.length));
	for (const comment of comments) {
		console.log(decorateString(comment));
	}
	console.log("-".repeat(header.length));
}

function formatStr(str, length) {
	if (str === undefined)
		return "".padEnd(10);
	if (str.length > length)
		return `${str.slice(0, length - 3)}...`;
	return str.padEnd(length);
}

// TODO you can do it!

function formatDate(date) {
	if (!(date instanceof Date))
		return date;
	if (isNaN(date))
		return "";
	let day = date.getDate().toString().padStart(2, "0");
	let month = (date.getMonth() + 1).toString().padStart(2, "0");
	let year = date.getFullYear();
	return `${day}-${month}-${year}`;
}

function decorateString(comment, indentLength = 2) {
	const isImportant = comment.importance !== 0;
	const indent = " ".repeat(indentLength);
	return `${isImportant ? "!" : " "}${indent}|${indent}${formatStr(comment.name, 10)}${indent}|${indent}${formatStr(formatDate(comment.date), 10)}${indent}|${indent}${formatStr(comment.comment, 50)}${indent}|${indent}${formatStr(comment.path, 20)}`;
}