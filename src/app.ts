#!/usr/bin/env node

if (!process.env.TODO_FILE) {
	process.env.TODO_FILE = 'todo'
}

const fs = require('node:fs');
const readline = require('node:readline');

const command = (fileName: string) {
	var args = process.argv.slice(2);

	if(args.length === 0) {
		// calling without arguments - list all todos
		printAll(fileName);
		return 0
	}

	// print help or print a single todo
	if (args.length === 1) {
		if(args[0] === "help") {
			console.log("todo <command>\n")
			console.log("Usage:\n")
			console.log("todo                           print the titles of all your todos")
			console.log("todo 1                         print todo number 1")
			console.log("todo 1 delete                  delete todo number 1")
			console.log("TODO_FILE=/misc/notes todo     use different file name and location")
			console.log("todo help                      print help")

			return 0
		}

		// print a single todo
		// Number() will return NaN if it's not a number
		const todoNumber = Number(args[0])
		if(!todoNumber) {
			console.log(`Todo must be a number. You entered '${args[0]}'`)
			process.exit(1)
		}

		printOne(fileName, todoNumber)
		return 0
	}

	// delete a single todo
	if (args.length === 2) {
		if(args[1] === "delete") {
			const todoNumber = Number(args[0])
			if(!todoNumber) {
				console.log(`Todo must be a number. You entered '${args[1]}'`)
				process.exit(1)
			}

			deleteOne(fileName, todoNumber)
		}
	}

	if (args.length > 2) {
		console.log("too many arguments")
	}
}

// return a single todo
async function printOne(fileName: string, todoNumber: number) {
	const exists = fs.existsSync(fileName)

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
			console.log(line)
		}

		if (line === "---") {
			index += 1
		}
  }
}

// if todo.txt exist, show the  titles of all the todos
async function printAll(fileName: string) {
	const exists = fs.existsSync(fileName)

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
			console.log(`Todo ${index}: ${line}`);
			okToPrint = false
		}
  }
}

// find lines to delete
// delete them

// return lines to delete
async function findLinesToDelete(fileName: string, todoNumber: number) {
	const exists = fs.existsSync(file)

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
	let lineNumber = 0
	let lines = []


	// Each line in input.txt will be successively available here as `line`.
  for await (const line of rl) {

		// first todo treated differently:
		// i need to delete all the lines until and including the first ---
		// the other todos - i need to delete the --- and all the lines until the nex ---

		// if it's the todo number I am looking for and not ---, print the line
		if(todoNumber === 1) {
			if (line === "---") {
				lines.push(lineNumber)
				break
			}

			lines.push(lineNumber)
			lineNumber += 1
			continue
		}

		// if i am here, it means todoNumber is > 1

		// --- after the todo
		if (line === "---" && index === todoNumber) {
			break
		}

		// first --- before the todo
		if (line === "---" && ((index + 1) === todoNumber)) {
			lines.push(lineNumber)
			lineNumber += 1
			index += 1
			continue
		}

		if (line === "---") {
			index += 1
			lineNumber += 1
			continue
		}

		// inside the todo
		if (index === todoNumber) {
			lines.push(lineNumber)
		}

		lineNumber += 1
  }

	return lines
}

async function deleteOne(fileName: string, todoNumber: number) {
	const linesToDelete = await findLinesToDelete(fileName, todoNumber)

	const removeLines = (data, lines = []) => {
			return data
					.split('\n')
					.filter((val, idx) => lines.indexOf(idx) === -1)
					.join('\n');
	}

	fs.readFile(fileName, 'utf8', (err, data) => {
			if (err) throw err

			// remove the first line and the 5th and 6th lines in the file
			fs.writeFile(fileName, removeLines(data, linesToDelete), 'utf8', function(err) {
					if (err) throw err
					console.log(`Task ${todoNumber} was deleted`)
			});
	})
}

command(process.env.TODO_FILE)
