# todo
A command line application that organizes the stuff I want to do.

## 1. Why I am building this?
I currently use a giant text file to organize the stuff I want to do. My items are separated by `---`. Very often I have a title and below it a few lines that gives me more context or addition things I need to do as part of this todo.
As soon as I have more than 5 todos, I find it hard to manage it. For example, I want to see only the titles, I want to move a todo to the top, or delete one quickly, I also want to search for keywords and for titles.
I realized I need to build somthing that will allow me to continue and using a text file with additional productivity boost using a command line utility.

I choose TypeScript as the programing language but I might build a similar app in Rust or Go in the future.

## 2. How does it looks like?

Here is a typical workflow:
```
todo help
todo <command>

Usage:

todo                            print the titles of all your todos
todo add "buy milk"             add todo
todo add                        add a todo with a text editor
todo 1                          print todo number 1
todo 1 delete (or d)            delete todo number 1
todo 1 edit (or e)              edit todo number 1
todo 1 mv 3                     move todo 1 to be number 3 (change priority)")
TODO_FILE=/misc/notes todo      use different file name and location
todo help                       print help
```

```
todo
Todo 1: move Russ's book to RM (it's in 'read' folder)
Todo 2: read about fast agile
Todo 3: add recipes
Todo 4: buy food
Todo 5: Read: Lessons from getting acquired by Google
```

```
todo 4

buy food

oatmeal, milk, chicken, avocados, eggs
```

```
todo 4 delete
Task 4 was deleted
```

```
todo
Todo 1: move Russ's book to RM (it's in 'read' folder)
Todo 2: read about fast agile
Todo 3: add recipes
Todo 4: Read: Lessons from getting acquired by Google
```

## 3. Using the application
This section is for those who just want to use it without changing anything.

### Setup
```
go build
./todo
```

### Commands
`todo help` - print help

`todo add "buy milk"` - add a todo

`todo add` - add a todo with a text editor

`todo` - print the titles of all todos

`todo 1` - print todo number 1

`todo 1 delete` - delete todo number 1 (also works with d)

`todo 1 edit` - edit todo number 1 (also works with e)

`todo 1 mv 3` - move todo 1 to be number 3 (change priority)

`TODO_FILE=/misc/notes todo` - change the location of your todo file using an environment variable

I am thinking of the following commands:

`todo show-configs` - show the value of TODO_FILE environment variable

### Backlog

* [x] add todo and title
* [x] print all todos
* [x] add todo (open text editor)
* [x] edit todo
* [x] show help
* [x] delete a single todo
* [ ] print a single todo
* [ ] file name and path is configurable
* [ ] change priority of a todo
* [ ] interactive mode
