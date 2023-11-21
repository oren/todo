#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const printAll_js_1 = __importDefault(require("./printAll.js"));
const printOne_js_1 = __importDefault(require("./printOne.js"));
const deleteOne_js_1 = __importDefault(require("./deleteOne.js"));
const changePriority_js_1 = __importDefault(require("./changePriority.js"));
if (!process.env.TODO_FILE) {
    process.env.TODO_FILE = 'todo';
}
const fs = require('node:fs');
const readline = require('node:readline');
const command = (fileName) => {
    var args = process.argv.slice(2);
    if (args.length === 0) {
        // calling without arguments - list all todos
        (0, printAll_js_1.default)(fileName);
        return 0;
    }
    // print help or print a single todo
    if (args.length === 1) {
        if (args[0] === "help") {
            console.log("todo <command>\n");
            console.log("Usage:\n");
            console.log("todo                           print the titles of all your todos");
            console.log("todo 1                         print todo number 1");
            console.log("todo 1 delete                  delete todo number 1");
            console.log("TODO_FILE=/misc/notes todo     use different file name and location");
            console.log("todo help                      print help");
            return 0;
        }
        // print a single todo
        // Number() will return NaN if it's not a number
        const todoNumber = Number(args[0]);
        if (!todoNumber) {
            console.log(`Todo must be a number. You entered '${args[0]}'`);
            process.exit(1);
        }
        (0, printOne_js_1.default)(fileName, todoNumber);
        return 0;
    }
    // delete a single todo
    if (args.length === 2) {
        if (args[1] === "delete") {
            const todoNumber = Number(args[0]);
            if (!todoNumber) {
                console.log(`Todo must be a number. You entered '${args[1]}'`);
                process.exit(1);
            }
            (0, deleteOne_js_1.default)(fileName, todoNumber);
            return 0;
        }
        console.log(`The second argument,${args[1]}, is not valid`);
    }
    if (args.length === 3) {
        if (args[1] === "mv") {
            const todo = Number(args[0]);
            if (!todo) {
                console.log(`The first argument must be a number. You entered '${args[0]}'`);
                process.exit(1);
            }
            const priority = Number(args[2]);
            if (!todo) {
                console.log(`The third argument must be a number. You entered '${args[2]}'`);
                process.exit(1);
            }
            (0, changePriority_js_1.default)(fileName, todo, priority);
            return 0;
        }
        console.log(`The second argument,${args[1]}, is not valid`);
    }
    if (args.length > 3) {
        console.log("too many arguments");
    }
};
command(process.env.TODO_FILE);
