Задача сделать консольную утилиту для фронтендера.

Утилита будет брать все файлы с расширением `.js` в текущей директории, находить в них все комментарии с `TODO`. Искать по ним, фильтровать, сортировать.

Мы уже написали за тебя метод для работы с консолью и методы для чтения из файлов. Осталось написать остальное =)

Для запуска используй команду `node index.js` При запуске специальный код ждет команды из консоли.

Сейчас он знает только команду `exit`, остальные нужно дописать тебе.

1. Получи из всех файлов все однострочные комментарии, начинающиеся с `TODO`. Все комментарии имеют одинаковое начало: два слеша, пробел, слово `TODO` капсом, снова пробел и дальше текст комментария. Например:

```
    // TODO Переделать это!
```

2. Сейчас метод `processCommand` обрабатывает только команду `exit` и завершает процесс в node. Научись обрабатывать еще одну команду из консоли:

```
    show : показать все todo
```

Выводить нужно стандартным выводом в консоль `console.log`. Можешь выводить как угодно твоим эстетическим чувствам: можно выводить просто массив в консоль, можно каждый элемент на новой строчке.

3. В комментарии может присутствовать восклицательный знак (!), что означает, что это задача с высоким приоритетом. Научись обрабатывать команду из консоли:

```
    important : показывать только todo, в которых есть восклицательный знак
```

4. Текст в todo может быть представлен обычным текстом.
   Или же использовать специальную разметку: `// TODO {Имя автора}; {Дата комментария}; {текст комментария}`
   После имени и даты обязательно ставится точка с запятой, а вот пробел между ними не обязателен.
   Научись обрабатывать еще одну команду из консоли:

```
    user {username} : показывать только комментарии от указанного пользователя
```

Причем имя пользователя должно быть регистронезависимо.
Пример команды: `
`

5. Научись обрабатывать команды

```
    sort {importance | user | date} : выводит отсортированные todo
```

Если аргумент `importance`, то сначала выводятся комментарии с восклицательными знаками, потом все остальные.

Чем больше восклицательных знаков, тем выше приоритет и тем выше в списке этот комментарий.

Если аргумент `user`, то выводятся задачи сгрупированные по пользователям, а в конце безымянные.

Если аргумент `date`, то выводятся сначала самые новые, потом постарше, потом без дат.

Примеры команд: `sort importance`, `sort user`, `sort date`

6. \* Научись обрабатывать команду:

```
    date {yyyy[-mm[-dd]]}: показывает все комментарии, созданные после переданной даты.
```

Датой может быть только год, год с месяцем (через дефис) или год с месяцем и днем.

Примеры команд: `date 2015`, `date 2016-02`, `date 2018-03-02`.

7. \* Научись выводить результаты в консоль в виде таблицы:

- каждая строка отображает один комментарий
- у таблицы должно быть четыре колонки: важность, пользователь, дата, комментарий
- между ячейками должен быть разделитель — вертикальная черта (|). А от вертикальной черты до текста должно быть минимум два пробела отступа. Вот так:

```
  !  |  pe          |  2018-03-02  |  sdkhsdfsdf
     |  pe          |  2018-03-02  |  sdkhsdfsdf
```

- если в комментарии есть восклицательные знаки, то в первой колонке нужно поставить символ !, в остальных случаях ничего не ставить
- ширина колонок (не считая отступ до вертикальных черт): 1, 10, 10, 50. При необходимости обрезай значение, поставив в конце многоточие (...), но учти, что обрезанный текст вместе с многоточием должен влезть в максимальную ширину колонки.
- вывод комментариев в командах `show`, `important`, `user {username}`, `sort {type}` и `date {date}` должен отображаться в виде этой таблички.

Для этой задачи тебе может пригодиться метод [padEnd](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)

8. \* Научись подбирать ширину колонкам по самому длинному значению. Вот так:

```
  корова  |  семья
  я       |  лук
  солнце  |  нехороший человек
```

Ограничения ширины из прошлого пункта (1, 10, 10, 50) считай за максимум возможной ширины.

9. \* Добавь таблице заголовок из 4 колонок:

```
  !  |  user  |  date  | comment
```

- ширина клеток заголовка тоже должна подбираться по самому длинному значению в этом столбце
- от остальной таблицы заголовок отделяется строкой со знаками минус (-) нужной длины. Должно получиться как-то так:

```
 !  |  user  |  date  | comment
---------------------------------
    |  pe    |  2012  | dddlsl
    |  pe    |  2012  | dddlsl
```

- для создания заголовка переиспользуй уже написанный код для остальных строк таблицы. Если нужно выделить новый метод — делай это.

- добавь строку из минусов еще и в конце таблицы.

Для этой задачи может пригодиться метод [repeat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

10. \* Выводи в таблицах кроме информации из todo еще и имя файла, в котором этот todo найден. Чтобы выделить имя файла из пути можно воспользоваться модулем [path](https://nodejs.org/api/path.html#path_path_basename_path_ext) из Node.js.
