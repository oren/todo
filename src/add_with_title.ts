const fs = require('node:fs');

export default function addWithTitle(fileName: string, title: string): Void {
    console.log("add TODO", title)

    let data = fs.readFileSync(fileName, 'utf-8');

    data = title + "\n\n---\n\n" + data

    // remove the first line and the 5th and 6th lines in the file
    fs.writeFileSync(fileName, data)
}