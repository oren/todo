#!/usr/bin/env node

import printAll from "./printAll.js";
import printOne from "./printOne.js";
import deleteOne from "./deleteOne.js";
import changePriority from "./changePriority.js";
import add from "./add.js";
import addWithTitle from "./add_with_title.js";
import edit from "./edit.js";

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

	// print help or print a single todo or interactive mode
	if (args.length === 1) {
		if(args[0] === "help") {
			console.log("todo <command>\n")
			console.log("Usage:\n")
			console.log("todo                           print the titles of all your todos")
			console.log("todo -i                        print the titles of all your todos, interactive mode")
			console.log('todo add "buy milk"            add a todo')
			console.log("todo add                       add a todo with a text editor")
			console.log("todo 1                         print todo number 1")
			console.log("todo 1 delete (or d)           delete todo number 1")
			console.log("todo 1 edit (or e)             edit todo number 1")
			console.log("todo 1 mv 3                    move todo 1 to be number 3 (change priority)")
			console.log("TODO_FILE=/misc/notes todo     use different file name and location")
			console.log("todo help                      print help")

			return 0
		}

		// open text editor
		if(args[0] === "add") {
			add(fileName)
			return 0
		}

		if(args[0] === "-i") {
			printAll(fileName, true);
			return 0
		}

		// print a single todo
		// Number() will return NaN if it's not a number
		const todoNumber = Number(args[0])
		if(!todoNumber) {
			console.log(`Task must be a number. You entered '${args[0]}'`)
			process.exit(1)
		}

		printOne(fileName, todoNumber)
		return 0
	}

	// add, delete, or edit
	if (args.length === 2) {
		if(args[0] === "add") {
			// TODO: validate the title of the todo
			addWithTitle(fileName, args[1])
			console.log(`Task was added`)
			return 0
		}

		if(args[1] === "delete" || args[1] === "d") {
			const todoNumber = Number(args[0])
			if(!todoNumber) {
				console.log(`Task must be a number. You entered '${args[1]}'`)
				process.exit(1)
			}

			deleteOne(fileName, todoNumber)
			console.log(`Task ${todoNumber} was deleted`) // how to call this AFTER deleteOne is completed?
			return 0
		}

		if(args[1] === "edit" || args[1] === "e") {
			const todoNumber = Number(args[0])
			if(!todoNumber) {
				console.log(`Task must be a number. You entered '${args[1]}'`)
				process.exit(1)
			}

			edit(fileName, todoNumber)
			console.log(`Task ${todoNumber} was edited`)
			return 0
		}

		console.log(`The second argument,${args[1]}, is not valid`)
	}

	if (args.length === 3) {

		if(args[1] === "mv") {
			const todo = Number(args[0])
			if(!todo) {
				console.log(`The first argument must be a number. You entered '${args[0]}'`)
				process.exit(1)
			}

			const priority = Number(args[2])
			if(!todo) {
				console.log(`The third argument must be a number. You entered '${args[2]}'`)
				process.exit(1)
			}

			changePriority(fileName, todo, priority)
			console.log(`Task ${todo} in now priority ${priority}`)
			return 0
		}

		console.log(`The second argument,${args[1]}, is not valid`)
	}

	if (args.length > 3) {
		console.log("too many arguments")
	}
}

command(process.env.TODO_FILE)
