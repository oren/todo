const fs = require('node:fs');
const readline = require('node:readline');

export default async function edit(fileName: string, todo: number): Void {
    // 1. read todo
    // 2. save to tmp file
    // 3. open tmp file with a text editor (VIM)
    // 4. read tmp file and modify todo

    // 1. read todo
    const todoContent = await read(fileName, todo)
    console.log('todoContent', todoContent)

    // 2. save to tmp file
}

// return a single todo
async function read(fileName: string, todoNumber: number) {
	const exists = fs.existsSync(fileName)
    let todoContent = []

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
            todoContent.push(line)
		}

		if (line === "---") {
			index += 1
		}
  }

  return todoContent
}
