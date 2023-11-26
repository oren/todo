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

// remove a todo and insert to a different location in the file. todo = target, priority = destination
export default async function changePriority(fileName: string, todo: number, priority: number) {
	const [numOfLines, content] = await deleteOne(fileName, todo)
	let destinationTodo = 0
	let todoCount = 1

	var todos = fs.readFileSync(fileName).toString().split("\n");

	if (priority > 1) {
		// find destinationTodo
		// loop on array until you are at the destination
		let i = 0
		for(; i < (todos.length -1); i++) {

			if(todos[i] === '---') {
				todoCount ++
			}

			if(todoCount === priority) {
				destinationTodo = i+1
				content.push('---')
				break
			}
		}	

		//destination is last element
		if(i === (todos.length-1)) {
			destinationTodo = todos.length - 1
			content.unshift('---')
		}
	}
	else {
		// destination is first element
		content.push('---')
	}

	todos.splice(destinationTodo, 0, ...content);
	
	// convert array to string with new lines
	var text = todos.join("\n");

	fs.writeFileSync(fileName, text, 'utf8')
}