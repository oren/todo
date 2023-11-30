const fs = require('node:fs');

// insert title as first todo
export default function addWithTitle(fileName: string, title: string): Void {
    let data = fs.readFileSync(fileName, 'utf-8');

    data = title + "\n\n---\n\n" + data

    fs.writeFileSync(fileName, data)
}
