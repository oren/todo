import fs from 'node:fs';
import readline from 'node:readline';

export default async function edit(fileName: string, todo: number): Void {
    // 1. read todo
    // 2. open tmp file with a text editor (VIM)
    // 3. read tmp file and modify todo

    // 1. read todo
    const todoContent = await read(fileName, todo)
		const text = todoContent.join("\n");
    console.log('todoContent', text)

		// 2. save in tmp file
		fs.writeFileSync('/tmp/todo.txt', text)

    // 3. open tmp file with a text editor (VIM)
    // when tmp file is saved, update todos file
		add(fileName)
}

// return a single todo in a format of array
async function read(fileName: string, todoNumber: number) {
	const exists = fs.existsSync(fileName)
    let todoContent = []

	if (!exists) {
		console.log(`${fileName} does not exists`)
		return
	}

  const fileStream = fs.createReadStream(fileName);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

	let index = 1

	// Each line in input.txt will be successively available here as `line`.
  for await (const line of rl) {
		// if it's the todo number I am looking for and not ---, print the line
		if(index === todoNumber) {
			if (line === "---") {
				break
			}
            todoContent.push(line)
		}

		if (line === "---") {
			index += 1
		}
  }

  return todoContent
}

// open tmp file with text editor. when saved, update todos file
function add(fileName: string): Void {
    const child_process = require('child_process')
    var editor = process.env.EDITOR || 'vi';

    var child = child_process.spawn(editor, ['/tmp/todo.txt'], {
        stdio: 'inherit'
    });

    child.on('exit', function (e, code) {
			// file was saves. add content to todos

			var todo = fs.readFileSync("/tmp/todo.txt").toString().split("\n");
			console.log('todo', todo)

			if(todo[todo.length-1] === '') {
					todo.pop()
			}

			var text = todo.join("\n");

			addTodo(fileName, text)
    });
}

// insert title as first todo
function addTodo(fileName: string, text, string, todoNum: number): Void {
    let data = fs.readFileSync(fileName, 'utf-8');

    data = text + "\n\n---\n\n" + data

    // remove the first line and the 5th and 6th lines in the file
    fs.writeFileSync(fileName, data)
}
