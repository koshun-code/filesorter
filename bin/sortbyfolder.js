#!/usr/bin/env node

import { program } from 'commander';
import moveToFolder from '../index.js';

program
  .version('1.0')
  .description('Find files and sort them by folders. You must point out it in file map.json')
  .arguments('<path>')
  .action((path) => {
    console.log(moveToFolder(path));
  })
  .parse(process.argv);
