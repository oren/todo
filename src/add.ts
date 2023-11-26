const fs = require('node:fs');
import addWithTitle from "./add_with_title.js";

export default function add(fileName: stringt): Void {

    const child_process = require('child_process')

    fs.rmSync("/tmp/todo.txt", {
        force: true,
    });

    var editor = process.env.EDITOR || 'vi';

    var child = child_process.spawn(editor, ['/tmp/todo.txt'], {
        stdio: 'inherit'
    });

    child.on('exit', function (e, code) {
        // add to todos

        var todo = fs.readFileSync("/tmp/todo.txt").toString().split("\n");

        if(todo[todo.length-1] === '') {
            todo.pop()
        

        addWithTitle(fileName, todo)
    });

}