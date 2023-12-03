import fs from 'node:fs';
import readline from 'node:readline';
import deleteOne from "./deleteOne.js";
import changePriority from "./changePriority.js";

export default async function edit(fileName: string, todoNumber: number): Void {
    // 1. read todo
    // 2. open tmp file with a text editor (VIM)
    // 3. read tmp file and modify todo

    // 1. read todo
    const todoContent = await read(fileName, todoNumber)
		const text = todoContent.join("\n");

		// 2. save in tmp file
		fs.writeFileSync('/tmp/todo.md', text)

    // 3. open tmp file with a text editor (VIM)
    // when tmp file is saved, update todos file
		add(fileName, todoNumber)
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
  // ('\r\n') in todo as a single line break.

	let index = 1

	// Each line in todo will be successively available here as `line`.
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
function add(fileName: string, todoNumber, number): Void {
	const child_process = require('child_process')
	var editor = process.env.EDITOR || 'vi';

	var child = child_process.spawn(editor, ['/tmp/todo.md'], {
			stdio: 'inherit'
	});

	child.on('exit', function (e, code) {
		// file was saves. add content to todos

		var todo = fs.readFileSync("/tmp/todo.md").toString().split("\n");

		if(todo[todo.length-1] === '') {
				todo.pop()
		}

		var text = todo.join("\n");

		addTodo(fileName, text, todoNumber)
	});
}

// insert saved todo into todos file. The location is todoNumber
async function addTodo(fileName: string, savedTodo: string, todoNumber: number): Void {
	// delete the original todo since we kept the edited todo in savedTodo variable
	await deleteOne(fileName, todoNumber)

	// add the saved todo to the top
	let data = fs.readFileSync(fileName, 'utf-8');
	data = savedTodo + "\n\n---\n\n" + data
	fs.writeFileSync(fileName, data)

	//replace the first todo with the target one
	changePriority(fileName, 1, todoNumber)
}
