require('jest');
const {TODO} = require("./TODO");
const {TODOs} = require("./TODOs");
const {TODOsViewer} = require("./TODOsViewer");

const simpleTODOs = `
// TODO todo_text1
function a(){}
const q = 1; 
const w = 2; // TODO todo_text2`;

const TODOsWithArgs = `
        function readFile(filePath) {
            return fs.readFileSync(filePath, 'utf8'); // TODO Veronika; 2018-08-16; сделать кодировку настраиваемой
        } настраиваемой
        // TODO Digi; 2018-09-21; Добавить функцию getFileName
        // TODO Digi;2020-10-21;Воспользоваться модулем path из Node.js`;

const TODOsWithImportance = `
        // TODO imp_1!
        // TODO imp_2!!
        const t = 123; // TODO not_imp
        const y = a; // TODO imp_3!`;


describe('show', () => {
    it('should parse simple TODOs', function () {
        const expected = [
            new TODO({content: 'todo_text1'}),
            new TODO({content: 'todo_text2'})
        ];
        const actual = new TODOs().getAllTODOs(simpleTODOs);

        expect(actual.list).toEqual(expected);
    });

    const expectedFromTODOsWithArgs = [
        new TODO({author: 'Veronika', date: new Date('2018-08-16'), content: 'сделать кодировку настраиваемой'}),
        new TODO({author: 'Digi', date: new Date('2018-09-21'), content: 'Добавить функцию getFileName'}),
        new TODO({author: 'Digi', date: new Date('2020-10-21'), content: 'Воспользоваться модулем path из Node.js'})
    ];
    it('should parse TODOs with args', function () {
        const actual = new TODOs().getAllTODOs(TODOsWithArgs);
        expect(actual.list).toEqual(expectedFromTODOsWithArgs);
    });

    it('should ignore wrong TODOs', function () {
        const wrongTODO = `
        // TODO author;wrong_date;
        `;
        const actual = new TODOs().getAllTODOs(TODOsWithArgs + wrongTODO);
        expect(actual.list).toEqual(expectedFromTODOsWithArgs);
    });
});

describe('important', () => {
    it('should return all TODOs with "!"', function () {
        const expected = [
            new TODO({content: 'imp_1!', importance: 1}),
            new TODO({content: 'imp_2!!', importance: 2}),
            new TODO({content: 'imp_3!', importance: 1}),
        ];
        const actual = new TODOs()
            .getAllTODOs(TODOsWithImportance)
            .selectImportant();

        expect(actual.list).toEqual(expected);
    });
});

describe('user', () => {
    const assertFilterByUser = (userName, expected) => {
        const actual = new TODOs()
            .getAllTODOs(TODOsWithArgs)
            .selectByUser(userName);

        expect(actual.list).toEqual(expected);
    };

    it('should filter by user', function () {
        const expected = [
            new TODO({author: 'Digi', date: new Date('2018-09-21'), content: 'Добавить функцию getFileName'}),
            new TODO({author: 'Digi', date: new Date('2020-10-21'), content: 'Воспользоваться модулем path из Node.js'})
        ];

        assertFilterByUser('Digi', expected);
    });
    it('should ignore case', function () {
        const userNames = ['Veronika', 'veronika', 'VeRoNiKa'];
        const expected = [
            new TODO({author: 'Veronika', date: new Date('2018-08-16'), content: 'сделать кодировку настраиваемой'})
        ];

        userNames.forEach(userName => assertFilterByUser(userName, expected)
        );
    });
});

describe('sort', () => {
    it('should sort by importance', function () {
        const expected = [
            new TODO({content: 'imp_2!!', importance: 2}),
            new TODO({content: 'imp_1!', importance: 1}),
            new TODO({content: 'imp_3!', importance: 1}),
            new TODO({content: 'todo_text1'}),
            new TODO({content: 'todo_text2'}),
            new TODO({content: 'not_imp'})
        ];

        const actual = new TODOs()
            .getAllTODOs(simpleTODOs + TODOsWithImportance)
            .sortByImportance();

        expect(actual.list).toEqual(expected);
    });

    it('should sort and group by user', function () {
        const expected = new Map();
        expected.set('Digi', [
            new TODO({author: 'Digi', date: new Date('2018-09-21'), content: 'Добавить функцию getFileName'}),
            new TODO({author: 'Digi', date: new Date('2020-10-21'), content: 'Воспользоваться модулем path из Node.js'})
        ]);
        expected.set('Veronika', [
            new TODO({author: 'Veronika', date: new Date('2018-08-16'), content: 'сделать кодировку настраиваемой'})
        ]);
        expected.set(undefined, [
            new TODO({content: 'todo_text1'}),
            new TODO({content: 'todo_text2'})
        ]);

        const actual = new TODOs()
            .getAllTODOs(simpleTODOs + TODOsWithArgs)
            .groupByUser();

        expect([...actual]).toEqual([...expected]);
    });

    it('should sort by user', function () {
        const expected = [
            new TODO({author: 'Digi', date: new Date('2018-09-21'), content: 'Добавить функцию getFileName'}),
            new TODO(
                {author: 'Digi', date: new Date('2020-10-21'), content: 'Воспользоваться модулем path из Node.js'}),
            new TODO({author: 'Veronika', date: new Date('2018-08-16'), content: 'сделать кодировку настраиваемой'}),
            new TODO({content: 'todo_text1'}),
            new TODO({content: 'todo_text2'})
        ];

        const actual = new TODOs()
            .getAllTODOs(simpleTODOs + TODOsWithArgs)
            .sortByUser();

        expect(actual.list.map(todo => todo.author)).toEqual(expected.map(todo => todo.author));
    });

    it('should sort by date', function () {
        const expected = [
            new TODO(
                {author: 'Digi', date: new Date('2020-10-21'), content: 'Воспользоваться модулем path из Node.js'}),
            new TODO({author: 'Digi', date: new Date('2018-09-21'), content: 'Добавить функцию getFileName'}),
            new TODO({author: 'Veronika', date: new Date('2018-08-16'), content: 'сделать кодировку настраиваемой'}),
            new TODO({content: 'todo_text1'}),
            new TODO({content: 'todo_text2'})
        ];

        const actual = new TODOs()
            .getAllTODOs(simpleTODOs + TODOsWithArgs)
            .sortByDate();

        expect(actual.list).toEqual(expected);
    });
});

describe('date', () => {
    const testCases = [
        ['2019',
            [
                new TODO({
                    author: 'Digi',
                    date: new Date('2020-10-21'),
                    content: 'Воспользоваться модулем path из Node.js'
                }),
                new TODO({
                    author: 'Markus',
                    date: new Date('2020-10-25'),
                    content: 'Сделать что-то)!!',
                    importance: 2
                })
            ]
        ],
        ['2018-08',
            [
                new TODO({
                    author: 'Veronika',
                    date: new Date('2018-08-16'),
                    content: 'сделать кодировку настраиваемой'
                }),
                new TODO({
                    author: 'Digi',
                    date: new Date('2018-09-21'),
                    content: 'Добавить функцию getFileName'
                }),
                new TODO({
                    author: 'Digi',
                    date: new Date('2020-10-21'),
                    content: 'Воспользоваться модулем path из Node.js'
                }),
                new TODO({
                    author: 'Markus',
                    date: new Date('2020-10-25'),
                    content: 'Сделать что-то)!!',
                    importance: 2
                })
            ]
        ],
        ['2020-10-22',
            [
                new TODO({
                    author: 'Markus',
                    date: new Date('2020-10-25'),
                    content: 'Сделать что-то)!!',
                    importance: 2
                })
            ]
        ]
    ];
    test.each(testCases)('should return TODOs after date "%s"', (date, expected) => {
        const actual = new TODOs()
            .getAllTODOs(simpleTODOs + TODOsWithArgs + `
            // TODO Markus; 2020-10-25; Сделать что-то)!!
            `)
            .selectAfter(date);

        expect(actual.list).toEqual(expected);
    });
});

describe('TodoViewer', () => {
    const testCases = [
        [
            new TODO({content: "todo_text"}),
            [1, 5, 10, 50, 20],
            `${' '.repeat(5)}|  ${' '.repeat(5)}  |  ${' '.repeat(10)}  |  ${'todo_text'.padEnd(50)}  |  ${" ".repeat(20)}`
        ],
        [
            new TODO({content: "todo_text!!", importance: 2}),
            [1, 10, 10, 50, 20],
            `  !  |  ${' '.repeat(10)}  |  ${' '.repeat(10)}  |  ${'todo_text'.padEnd(50)}  |  ${" ".repeat(20)}`
        ],
        [
            new TODO({content: "sdkhsdfsdf", author: 'pe', date: new Date('2018-03-02')}),
            [1, 10, 10, 50, 20],
            `     |  pe          |  2018-03-02  |  ${'sdkhsdfsdf'.padEnd(50)}  |  ${" ".repeat(20)}`
        ]
    ];
    test.each(testCases)('should format todo', function (todo, columnsSize, expected) {
        const actual = new TODOsViewer(columnsSize).createRow(todo);
        expect(actual).toBe(expected);
    });

    it('should truncate long strings', function () {
        const expected = `     |  ${'a'.repeat(9)}…  |              |  ${"t".repeat(39)}…  |  ${" ".repeat(20)}`;
        const todo = new TODO({content: 't'.repeat(100), author: 'a'.repeat(100)});
        const actual = new TODOsViewer([1, 20, 10, 40, 100]).createRow(todo);
        expect(actual).toBe(expected);
    });
});
