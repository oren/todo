const fs = require('node:fs');
const readline = require('node:readline');
import select, { Separator } from '@inquirer/select';
import printOne from "./printOne.js";

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
			if(interactive) {
				displayLine = `Task ${index} ${line}`
				todos.push({name: displayLine, value: index, description: 'none'})
			}
			else {
				console.log(`Todo ${index}: ${line}`);
			}
			okToPrint = false
		}
  }

	if(!interactive) return

	const answer = await select({
		message: 'Select a task',
		choices: todos,
		pageSize: 20,
		loop: false,
	});

	printOne(fileName, answer)
}


