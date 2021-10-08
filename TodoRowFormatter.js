Object.assign(String.prototype, {
    truncate(length) {
        if (this.length <= length)
            return this;
        return this.substring(0, length - 1) + "…";
    },
    adjustLength(length) {
        if (this.length < length)
            return this.padEnd(length);
        if (this.length > length)
            return this.truncate(length);
        return this;
    }
});

class TodoRowFormatter {
    todo;
    columnsSize;
    padding = 2;

    constructor(todo, columnsSize) {
        this.todo = todo;
        this.columnsSize = columnsSize;
    }

    getFormatted() {
        const importance = this.formatImportance();
        const author = this.formatAuthor();
        const date = this.formatDate();
        const content = this.formatContent();
        const file = this.formatFile();
        return [importance, author, date, content, file].join(
            `${' '.repeat(this.padding)}|${' '.repeat(this.padding)}`);
    }

    formatImportance() {
        return `  ${this.todo.importance ? "!" : " "}`;
    }

    formatAuthor() {
        return (this.todo.author || "").adjustLength(this.columnsSize[1]);
    }

    formatContent() {
        return this.todo.content.replace(/!/g, "").adjustLength(this.columnsSize[3]);
    }

    formatDate() {
        const date = this.todo.date;
        let dateString = date ? this.formattedDate(date) : "";
        return dateString.padEnd(this.columnsSize[2]);
    }

    formattedDate(date) {
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${year}-${month}-${day}`;
    }

    formatFile() {
        return (this.todo.file || "").adjustLength(this.columnsSize[4]);
    }

}

class TodoHeaderFormatter extends TodoRowFormatter {
    formatDate() {
        return this.todo.date.adjustLength(this.columnsSize[2]);
    }
}

module.exports = {
    TodoRowFormatter,
    TodoHeaderFormatter
};