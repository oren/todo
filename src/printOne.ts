const fs = require('node:fs');
const readline = require('node:readline');

// return a single todo
export default async function printOne(fileName: string, todoNumber: number) {
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
