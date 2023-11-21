"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('node:fs');
const readline = require('node:readline');
// return lines to delete
function findLinesToDelete(fileName, todoNumber) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const exists = fs.existsSync(fileName);
        if (!exists) {
            console.log(`${fileName} does not exists`);
            return;
        }
        const fileStream = fs.createReadStream(fileName);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        let index = 1;
        let lineNumber = 0;
        let lines = [];
        let content = "";
        try {
            // Each line in input.txt will be successively available here as `line`.
            for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), _a = rl_1_1.done, !_a; _d = true) {
                _c = rl_1_1.value;
                _d = false;
                const line = _c;
                // first todo treated differently:
                // i need to delete all the lines until and including the first ---
                // the other todos - i need to delete the --- and all the lines until the nex ---
                // if it's the todo number I am looking for
                if (todoNumber === 1) {
                    if (line === "---") {
                        lines.push(lineNumber);
                        break;
                    }
                    lines.push(lineNumber);
                    // content += line + '\n'
                    content = content + "---";
                    lineNumber += 1;
                    continue;
                }
                // if i am here, it means todoNumber is > 1
                // --- after the todo
                if (line === "---" && index === todoNumber) {
                    // content += line + '\n'
                    content = content + "---";
                    break;
                }
                // first --- before the todo
                if (line === "---" && ((index + 1) === todoNumber)) {
                    lines.push(lineNumber);
                    lineNumber += 1;
                    index += 1;
                    continue;
                }
                if (line === "---") {
                    index += 1;
                    lineNumber += 1;
                    continue;
                }
                // inside the todo
                if (index === todoNumber) {
                    lines.push(lineNumber);
                    content += line + '\n';
                }
                lineNumber += 1;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = rl_1.return)) yield _b.call(rl_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return [lines, content];
    });
}
// find lines to delete
// delete them
function deleteOne(fileName, todoNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const [linesToDelete, content] = yield findLinesToDelete(fileName, todoNumber);
        const removeLines = (data, lines = []) => {
            return data
                .split('\n')
                .filter((val, idx) => lines.indexOf(idx) === -1)
                .join('\n');
        };
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err)
                throw err;
            // remove the first line and the 5th and 6th lines in the file
            fs.writeFile(fileName, removeLines(data, linesToDelete), 'utf8', function (err) {
                if (err)
                    throw err;
                if (!content) {
                    console.log(`Task ${todoNumber} was deleted`);
                }
            });
        });
        return [content, linesToDelete.length - 1];
    });
}
exports.default = deleteOne;
