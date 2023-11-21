const fs = require('node:fs');
const readline = require('node:readline');

// return lines to delete
async function findLinesToDelete(fileName: string, todoNumber: number) {
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
	let lineNumber = 0
	let lines = []
	let content = ""


	// Each line in input.txt will be successively available here as `line`.
  for await (const line of rl) {

		// first todo treated differently:
		// i need to delete all the lines until and including the first ---
		// the other todos - i need to delete the --- and all the lines until the nex ---

		// if it's the todo number I am looking for
		if(todoNumber === 1) {
			if (line === "---") {
				lines.push(lineNumber)
				break
			}

			lines.push(lineNumber)
			// content += line + '\n'
			content = content + "---"
			lineNumber += 1
			continue
		}

		// if i am here, it means todoNumber is > 1

		// --- after the todo
		if (line === "---" && index === todoNumber) {
			// content += line + '\n'
			content = content + "---"
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
			content += line + '\n'
		}

		lineNumber += 1
  }

	return [lines, content]
}

// find lines to delete
// delete them
export default async function deleteOne(fileName: string, todoNumber: number) {
	const [linesToDelete, content] = await findLinesToDelete(fileName, todoNumber)

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

				if(!content) {
					console.log(`Task ${todoNumber} was deleted`)
				}
		});
	})

	return [content, linesToDelete.length - 1]
}
