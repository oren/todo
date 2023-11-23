const fs = require('node:fs');
import deleteOne from "./deleteOne.js";

// sync version. not working yet
// export default function changePriority(fileName: string, todo: number, priority: number) {
// 	// convert file to array
// 	var todos = fs.readFileSync(fileName).toString().split("\n");

// 	// probably a linux issue. added line at the end of the file
// 	todos.pop()

// 	console.log("todos", todos)

// 	let meta = []
// 	let todoNumber = 1

// 	// create the meta array
// 	for (let i in todos) {
// 		if(todos[i] === '---') {
// 			todoNumber += 1
// 		}
// 		meta[i] = todoNumber
// 	}

// 	console.log("meta", meta)

// 	// save todo in a temp array
// 	let tmp = []
// 	let j = 0

// 	for (let i in todos) {
// 		if(meta[i] === todo) {
// 			tmp[j] = todos[i]
// 			j += 1
// 		}
// 	}
// 	console.log("keep", tmp)
// 	console.log("todo before delete", todos)
// 	// chop --- from start of tmp, add --- to the end
// 	if(priority === 1) {
// 		tmp.shift()
// 		tmp.push('---')
// 	}
// 	else {
// 		tmp.push('')
// 	}

// 	// delete todo from original location
// 	for (var i = todos.length -1; i>=0; i--) {
// 		if(meta[i] === todo) {
// 			todos.splice(i, 1)
// 			meta.splice(i, 1)
// 		}
// 	}

// 	console.log("meta after delete", meta)
// 	console.log("todo after delete", todos)

// 	// add temp array to new location
// 	for (let i in meta) {
// 		console.log(meta[i])

// 		// insert tmp
// 		if (meta[i] === priority) {
// 			todos.splice(i, 0, ...tmp)
// 			break
// 		}
// 	}
// 	console.log("todo after insert", todos)

// 	const text = todos.join("\n");
// 	fs.writeFile(fileName, text, function (err) {
// 		if (err) return console.log(err);
// 	});
// }

// not working. deleteOne is not complete when reading the file (line 81)
export default async function changePriority(fileName: string, todo: number, priority: number) {
	// cut todo
	// paste to a different location (priority)
	const [content, numOfLines] = await deleteOne(fileName, todo)

	console.log('---')
	console.log('inside changePriority')

	var todos = fs.readFileSync(fileName).toString().split("\n");
	console.log('todos before splice:', todos)
  todos.splice(0, 0, content);
	console.log('todos after splice:', todos)
	console.log('---')

	var text = todos.join("\n");

	fs.writeFile(fileName, text, function (err) {
		if (err) return console.log(err);
	});
}
