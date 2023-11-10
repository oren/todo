#!/usr/bin/env node

const convert = (dir: string) => {
	console.log('here')
}

const fs = require('node:fs');
const readline = require('node:readline');

const command = () {
	var args = process.argv.slice(2);

	if(args.length === 0) {
		// calling without arguments - list all todos
		printAll("todo");
	}
	else if (args.length === 1) {
		// calling with 1 arguments - show a single todo

		// Number() will return NaN if it's not a number
		const taskNumber = Number(args[0])
		if(!taskNumber) {
			console.log(`Task must be a number. You entered '${args[0]}'`)
			return 1
		}

		printOne("todo", taskNumber)
	}
	else {
		console.log("too many arguments")
	}
}

// return a single todo
async function printOne(file: string, taskNumber: number) {
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

	let index = 1

	// Each line in input.txt will be successively available here as `line`.
  for await (const line of rl) {

		// if it's the task number I am looking for and not ---, print the line
		if(index === taskNumber) {
			if (line === "---") {
				break
			}
			console.log(line)
		}

		if (line === "---") {
			index += 1
		}
  }
}

// if todo.txt exist, show the  titles of all the todos
async function printAll(file: string) {
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

	let okToPrint = true
	let index = 1

	// Each line in input.txt will be successively available here as `line`.
  for await (const line of rl) {

		// if --- -> increment index, okToPrint and continue
		// if text and ok to print -> print, not okToPrint

		if(line === "---") {
			index +=1
			okToPrint = true
			continue
		}

		if(line !== "" && okToPrint) {
			console.log(`task ${index}: ${line}`);
			okToPrint = false
		}
  }
}

command()
