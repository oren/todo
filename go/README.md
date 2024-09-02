# TODO app in Golang

## High level steps:
* wtire the first test: todo add "buy milk" should create todo.md with 1 line.
* setup nvim to work with go.
* write code to pass the test. 

## What's working?
Curently I have 2 modules: hello and todo.

running `go run .` inside hello folder will use the todo module.

## Features
* `todo tags` display list of tags. A tag is defined with @tag-name right after the title of the todo. If no tag is defined it will be under the @misc tag.

## Run tests
```
cd go/todo
go test
```
