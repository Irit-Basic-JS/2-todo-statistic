class TODO {
    author;
    date;
    content;
    importance;
    file;

    constructor(options) {
        this.author = options.author;
        this.date = options.date;
        this.content = options.content;
        this.importance = options.importance || 0;
        this.file = options.file;
    }
}

module.exports={
    TODO
};