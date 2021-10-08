const {TODO} = require("./TODO");
const {TodoHeaderFormatter, TodoRowFormatter} = require("./TodoRowFormatter");

class TODOsViewer {
    columnsMaxSize = [1, 10, 10, 50, 20];
    columnsSize;
    padding = 2;

    constructor(columnsSize) {
        this.columnsSize = this.validateSizes(columnsSize);
    }

    validateSizes(columnsSize) {
        const sizes = [];
        for (let i = 0; i < this.columnsMaxSize.length; i++)
            sizes.push(Math.min(this.columnsMaxSize[i], columnsSize[i]));
        return sizes;
    }

    createRow(todo) {
        const formatter = new TodoRowFormatter(todo, this.columnsSize);
        formatter.padding = this.padding;
        return formatter.getFormatted();
    }


    createHorizontalLine() {
        const rowLength = this.columnsSize.reduce((previousValue, currentValue) => previousValue + currentValue)
            + this.padding * 2 * this.columnsSize.length;
        return '-'.repeat(rowLength);
    }

    createHeader() {
        return new TodoHeaderFormatter(
            new TODO({importance: 1, author: 'user', date: 'date', content: 'comment'}), this.columnsSize
        ).getFormatted();
    }
}

module.exports = {
    TODOsViewer
};