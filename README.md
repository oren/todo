# TODO List
A command line application that organizes the stuff I want to do.

## Setup
```
npm install -g typescript #TODO: verify if that's a good approach
npm install
npm start
```

## Development flow
* When I change app.ts, the typescript compiler generate build/app.js
* The command `npm link` allow me to run the program as a script from any location on my laptop with the command `todo`. The location of the js file is /home/oren/.nvm/versions/node/v18.18.0/bin/todo
* The template.html file is located in the 'build' folder

## Backlog

* [ ] list all todos
* [ ] add todo

## Notes

### Run as linux script
In order to run this program as a linux script, in ./app.js I added the first line: #!/usr/bin/env node.

### Nicer name for the script
* In order to call the script with `todo` instead of ./app.js I have an entry in package.json called bin.
This only worked after I also run the command `npm link` which allow me to call my program anywhere on my laptop.
* In order to unlink, run `npm unlink todo`.

## Automatic build on file change
I use nodemon and concurrently locally. They can also installed with globally (with -g).

### Other ways to run ts files
* `npx ts-node ~/scripts/site-generator.ts`. npx is a shortcut for npm exec, which runs scripts from packages, and ts-node is a wrapper for node that compiles and runs ts as a single step; it's essentially tsc and node in a single command

## References

* https://www.typescripttutorial.net/typescript-tutorial/nodejs-typescript/
* https://github.com/showdownjs/showdown
* https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
* https://github.com/SteveRidout/flashdown/tree/master
