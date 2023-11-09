#!/usr/bin/env node

const convert = (dir: string) => {
	console.log('here')
}

// if todo.txt exist, show the content

const fs = require('node:fs');
const readline = require('node:readline');

const command = () {
	var args = process.argv.slice(2);

	if(args.length === 0) {
		// calling without arguments - list all todos
		listTodo("todo");
	}
	else if (args.length === 1) {
		// calling with 1 arguments - show a single todo
		showTodo("todo", args[0])
	}
	else {
		console.log("too many arguments")
	}
}

// not working yet
async function showTodo(file: string, taskToShow: int) {
	const exists = fs.existsSync(file)

	if (!exists) {
		console.log("todo.txt does not exists")
		return
	}

  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

	let delimiterFound = false
	let taskNumber = 0

	// Each line in input.txt will be successively available here as `line`.
  for await (const line of rl) {

		// if delimiter was found, read the first non empty line
		if(delimiterFound) {
			if(line === "") {
				continue
			}

			taskNumber += 1

			console.log(`task ${taskNumber}: ${line}`);

			delimiterFound = !delimiterFound
		}

		if(line === "---") {
			console.log("show", taskToShow)
			console.log("num", taskNumber)

			if(taskNumber === taskToShow) {
				console.log("found it");
			}
			delimiterFound = !delimiterFound
			continue
		}
  }
}

async function listTodo(file: string) {
	const exists = fs.existsSync(file)

	if (!exists) {
		console.log("todo.txt does not exists")
		return
	}

  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

	let delimiterFound = false
	let taskNumber = 0

	// Each line in input.txt will be successively available here as `line`.
  for await (const line of rl) {

		// if delimiter was found, read the first non empty line
		if(delimiterFound) {
			if(line === "") {
				continue
			}

			taskNumber += 1
			console.log(`task ${taskNumber}: ${line}`);
			delimiterFound = !delimiterFound
		}

		if(line === "---") {
			delimiterFound = !delimiterFound
			continue
		}
  }
}

command()
