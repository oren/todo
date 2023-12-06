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
				// todos.push({name: displayLine, value: index, description: 'none'})
				todos.push(displayLine)
			}
			else {
				console.log(`${index} ${line}`);
			}
		}
  }

	// todo -i. Show interactive list
	if(!interactive) return

	const blessed = require('blessed');
	const screen = blessed.screen({smartCSR: true});

	screen.title = "Tasks:"
	screen.key(['escape', 'q', 'C-c'], function() { screen.destroy(); process.exit(0); });

	const taskList = blessed.list({
		parent: screen, // Can't capture events if we use screen.append(taskList)
		label: '',
		content: '',
		top: 1,
		border: {
			transparent: true
		},
		height: '100%-3',
		items: todos,
		interactive: true,
		keys: true,
		fg: 'blackBright',
		selectedFg: 'grey',
		selectedBg: 'lightblue'
	});

	taskList.key('enter', function() {
		// console.log('got an "enter"', this.selected, this.items[this.selected].content);
		printOne(fileName, this.selected, true)
		// return process.exit(0)
		// screen.destroy()
	});

	taskList.key('d', function() {
		console.log('got an "d"', this.selected, this.items[this.selected].content);
			deleteOne(fileName, this.selected)
			console.log(`Task ${this.selected} was deleted`)
			// return process.exit(0)
	});

	taskList.key('e', function() {
		console.log('got an "e"', this.selected, this.items[this.selected].content);
			edit(fileName, this.selected)
			console.log(`Task ${this.selected} was edited`)
			// return process.exit(0)
	});

	screen.render();

	// return
}
