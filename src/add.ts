export default function add(fileName: string, title: string): Void {
    const child_process = require('child_process')
    var editor = process.env.EDITOR || 'vi';

    var child = child_process.spawn(editor, ['/tmp/somefile.txt'], {
        stdio: 'inherit'
    });

    child.on('exit', function (e, code) {
        console.log("finished");
    });
}