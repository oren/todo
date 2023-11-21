const fs = require('node:fs');
const readline = require('node:readline');

// if todo.txt exist, show the  titles of all the todos
export default async function printAll(fileName: string) {
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
