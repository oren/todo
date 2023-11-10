#!/usr/bin/env node
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
const convert = (dir) => {
    console.log('here');
};
const fs = require('node:fs');
const readline = require('node:readline');
const command = () => {
    var args = process.argv.slice(2);
    if (args.length === 0) {
        // calling without arguments - list all todos
        printAll("todo");
        return 0;
    }
    // print help or print a single todo
    if (args.length === 1) {
        if (args[0] === "help") {
            console.log("todo <command>\n");
            console.log("Usage:\n");
            console.log("todo           print the titles of all your todos");
            console.log("todo 1         print todo number 1");
            console.log("todo help      print help");
            return 0;
        }
        // print a single todo
        // Number() will return NaN if it's not a number
        const todoNumber = Number(args[0]);
        if (!todoNumber) {
            console.log(`Todo must be a number. You entered '${args[0]}'`);
            process.exit(1);
        }
        printOne("todo", todoNumber);
        return 0;
    }
    // delete a single todo
    if (args.length === 2) {
        if (args[0] === "delete") {
            const todoNumber = Number(args[1]);
            if (!todoNumber) {
                console.log(`Todo must be a number. You entered '${args[1]}'`);
                process.exit(1);
            }
            deleteOne("todo", todoNumber);
        }
    }
    if (args.length > 2) {
        console.log("too many arguments");
    }
};
// delete a single todo. not working yet
function deleteOne(file, todoNumber) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const exists = fs.existsSync(file);
        if (!exists) {
            console.log("todo.txt does not exists");
            return;
        }
        const fileStream = fs.createReadStream(file);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        try {
            // Note: we use the crlfDelay option to recognize all instances of CR LF
            // ('\r\n') in input.txt as a single line break.
            // Each line in input.txt will be successively available here as `line`.
            for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), _a = rl_1_1.done, !_a; _d = true) {
                _c = rl_1_1.value;
                _d = false;
                const line = _c;
                console.log(line);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = rl_1.return)) yield _b.call(rl_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
// return a single todo
function printOne(file, todoNumber) {
    var _a, e_2, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const exists = fs.existsSync(file);
        if (!exists) {
            console.log("todo.txt does not exists");
            return;
        }
        const fileStream = fs.createReadStream(file);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        let index = 1;
        try {
            // Each line in input.txt will be successively available here as `line`.
            for (var _d = true, rl_2 = __asyncValues(rl), rl_2_1; rl_2_1 = yield rl_2.next(), _a = rl_2_1.done, !_a; _d = true) {
                _c = rl_2_1.value;
                _d = false;
                const line = _c;
                // if it's the todo number I am looking for and not ---, print the line
                if (index === todoNumber) {
                    if (line === "---") {
                        break;
                    }
                    console.log(line);
                }
                if (line === "---") {
                    index += 1;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = rl_2.return)) yield _b.call(rl_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
// if todo.txt exist, show the  titles of all the todos
function printAll(file) {
    var _a, e_3, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const exists = fs.existsSync(file);
        if (!exists) {
            console.log("todo.txt does not exists");
            return;
        }
        const fileStream = fs.createReadStream(file);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        let okToPrint = true;
        let index = 1;
        try {
            // Each line in input.txt will be successively available here as `line`.
            for (var _d = true, rl_3 = __asyncValues(rl), rl_3_1; rl_3_1 = yield rl_3.next(), _a = rl_3_1.done, !_a; _d = true) {
                _c = rl_3_1.value;
                _d = false;
                const line = _c;
                // if --- -> increment index, okToPrint and continue
                // if text and ok to print -> print, not okToPrint
                if (line === "---") {
                    index += 1;
                    okToPrint = true;
                    continue;
                }
                if (line !== "" && okToPrint) {
                    console.log(`Todo ${index}: ${line}`);
                    okToPrint = false;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = rl_3.return)) yield _b.call(rl_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
    });
}
command();
