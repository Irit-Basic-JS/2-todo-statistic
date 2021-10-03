const {TODO} = require("./TODO");

class TODOs {
    list = [];

    constructor(todos = []) {
        this.list = todos;
    }

    getAllTODOs(text, fileName = undefined) {
        const todoPattern = /\/\/ TODO ((?<author>\w*); ?)?((?<date>.*); ?)?(?<text>.*)/gm;
        const matches = [...text.matchAll(todoPattern)];
        const todos = this.createTODOs(matches, fileName);
        return new TODOs(todos);
    }

    createTODOs(matches, fileName = undefined) {
        const todos = [];
        for (const match of matches) {
            if (match.groups.text.length < 1)
                continue;
            todos.push(this.createTodoFromMatch(match, fileName));
        }
        return todos;
    }

    createTodoFromMatch(match, fileName = undefined) {
        return new TODO({
            author: match.groups.author,
            date: match.groups.date ? new Date(match.groups.date) : undefined,
            content: match.groups.text,
            importance: (match.groups.text.match(/!/gm) || []).length,
            file: fileName
        });
    }

    selectImportant() {
        return new TODOs(this.list.filter(todo => todo.importance > 0));
    }

    selectByUser(userName) {
        return new TODOs(this.list.filter(todo => todo.author.toLowerCase() === userName.toLowerCase()));
    }

    sortByImportance() {
        return new TODOs(this.list.sort((a, b) => a.importance <= b.importance ? 1 : -1));
    }

    groupByUser() {
        const groups = new Map();
        for (const todo of this.list) {
            const author = todo.author;
            if (!(groups.has(author)))
                groups.set(author, []);
            groups.get(author).push(todo);
        }
        return this._sortByUser(groups);
    }

    _sortByUser(map) {
        return new Map([...map.entries()].sort(this._userNameComparer));
    }

    _userNameComparer(a, b) {
        if (a[0] === undefined)
            return 1;
        if (b[0] === undefined)
            return -1;
        return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
    }

    sortByUser() {
        return new TODOs(this.list.sort((a, b) => -this._userNameComparer(a, b)));
    }

    sortByDate() {
        return new TODOs(this.list.sort((a, b) => {
            if (a.date === undefined)
                return 1;
            if (b.date === undefined)
                return -1;
            return a > b ? 1 : -1;
        }));
    }

    selectAfter(date) {
        const desiredDate = new Date(date);
        return new TODOs(this.list.filter(todo =>
            todo.date === undefined ? false : todo.date >= desiredDate
        ));
    }
}

module.exports = {
    TODOs
};