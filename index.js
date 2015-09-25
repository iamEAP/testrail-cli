#! /usr/bin/env node

"use strict";

var argv = require('minimist')(process.argv.slice(2)),
    cliFactory = require('./src/cli.js'),
    command = argv._[0],
    cli;

console.log('debugging...');

// Instantiate the CLI.
cli = cliFactory(
  require('./src/core.js'),
  require('node-testrail'),
  argv
);

// Check if the provided command exists, then execute.
if (cli.hasOwnProperty(command)) {
  cli[command]();
}
else {
  console.error('Unknown command "' + command + '"');
  process.exit(1);
}
