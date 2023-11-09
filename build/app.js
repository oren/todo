#!/usr/bin/env node
"use strict";
const convert = (dir) => {
    console.log('here');
};
// if todo.txt exist, show the content
const listTodo = () => {
    const fs = require("fs");
    const exists = fs.existsSync("todo.txt");
    if (exists) {
        const data = fs.readFileSync('todo.txt', 'utf8');
        console.log('todos:');
        console.log(data);
    }
    else {
        console.log("todo.txt does not exists");
    }
};
// calling without arguments list all todos
listTodo();
