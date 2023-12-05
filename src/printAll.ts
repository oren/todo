const fs = require('node:fs');
const readline = require('node:readline');
import select, { Separator } from './select';
import edit from "./edit.js";
import deleteOne from "./deleteOne.js";
import printOne from "./printOne.js";
import chalk from 'chalk';

// if todo file exist, show the  titles of all the todos
export default async function printAll(fileName: string, interactive: boolean) {
	const exists = fs.existsSync(fileName)
	let todos = []

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

	let okToPrint = true
	let index = 1
	let displayLine = ""

	// Each line in todo will be successively available here as `line`.
  for await (const line of rl) {

		// if --- -> increment index, okToPrint and continue
		// if text and ok to print -> print, not okToPrint

		if(line === "---") {
			index +=1
			okToPrint = true
			continue
		}

		if(line !== "" && okToPrint) {
			okToPrint = false

			if(interactive) {
				displayLine = `${index} ${line}`
				todos.push({name: displayLine, value: index, description: 'none'})
			}
			else {
				console.log(`${index} ${line}`);
			}
		}
  }

	// todo -i. Show interactive list
	if(!interactive) return

	// get the number of vertical lines in the terminal.
	// It's not working. From some reason I get 24 everytime.

	// const execSync = require('child_process').execSync;
	// const lines = Number(execSync('tput lines').toString());
	// console.log('lines', lines)

	// there are 3 options for result: 12 or e12, or d12 (12 is the todo number)
	const result  = await select({
		message: 'Enter:show e:edit d:delete q:quit',
		choices: todos,
		pageSize: 20,
		loop: false,
	});

	// delete or edit
	if (isNaN(result) {
		const action = result[0]
		const todoNumber = Number(result.slice(1))
		if (action === 'e') {
			edit(fileName, todoNumber)
			console.log(`Task ${todoNumber} was edited`)
			return
		} else if (action === 'd') {
			await deleteOne(fileName, todoNumber)
			console.log(`Task ${todoNumber} was deleted`)
			return
		} else if (action === 'q') {
			return
		}
		return
	}

	printOne(fileName, Number(result))
}


