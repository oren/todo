const fs = require('node:fs');
import addWithTitle from "./add_with_title.js";

// open text editor and when file is saved, add as first todo
export default function add(fileName: string): Void {
    const child_process = require('child_process')

    fs.rmSync("/tmp/todo.txt", {
        force: true,
    });

    var editor = process.env.EDITOR || 'vi';

    var child = child_process.spawn(editor, ['/tmp/todo.txt'], {
        stdio: 'inherit'
    });

    child.on('exit', function (e, code) {
        // file was saves. add content to todos

        var todo = fs.readFileSync("/tmp/todo.txt").toString().split("\n");

        if(todo[todo.length-1] === '') {
            todo.pop()
        }

        var text = todo.join("\n");

        addWithTitle(fileName, text)
    });

}
