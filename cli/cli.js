#!/usr/bin/env node
/**
 * TODO:
 * [ ] clean everything up
 * [ ] actually clear out the file (or not?)
 * [ ] open the file in vscode
 * [ ] start a test session?
 * [ ] consider adding functionality to group by category?
 */
import {readdirSync, statSync} from 'fs';

import chalk from 'chalk';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
inquirer.registerPrompt('search-list', inquirerSearchList);

import chalkAnimation from 'chalk-animation';

const delay = 1000;

async function cli() {
  const concepts = getConcepts();

  const welcome = chalkAnimation.neon('\nWELCOME TO CS DOJO!!!\n');

  await sleep(delay);

  welcome.stop();

  const practiceTypes = ['random', 'specific'];
  const practiceType = 'practice type';
  const practiceTypeResponse = await inquirer.prompt({
    name: practiceType,
    type: 'list',
    message: 'What type of practice do you want to do today?\n',
    choices: practiceTypes,
  });

  let practiceProblem;
  if (practiceTypeResponse[practiceType] === 'random') {
    practiceProblem = concepts[Math.floor(Math.random() * concepts.length)];
  } else {
    const problemSelection = 'problem';
    const res = await inquirer.prompt({
      name: problemSelection,
      type: 'search-list',
      message: 'What concept would you like to practice?\n',
      choices: concepts.map(c => c.name),
    });
    practiceProblem = res[problemSelection];
  }

  console.log(
    'Looks like we will be practicing ',
    chalk.bold(practiceProblem.name),
    ' today!'
  );
}

async function sleep(ms = 2000) {
  await new Promise(r => setTimeout(r, ms));
}

function getConcepts() {
  const dir = './src';

  const allFiles = findFilesInDir(dir);

  const testFiles = allFiles.filter(f => f.indexOf('test') >= 0);

  const codeFilesWithTestFiles = allFiles.filter(
    f =>
      f.indexOf('test') === -1 &&
      testFiles.indexOf(f.slice(0, -3) + '.test.ts') >= 0
  );

  const out = [];

  for (const file of codeFilesWithTestFiles) {
    out.push({
      name: file.split('/').pop().slice(0, -3),
      path: file,
    });
  }

  return out;
}

function findFilesInDir(dir) {
  let results = [];
  const list = readdirSync(dir);

  for (let file of list) {
    file = dir + '/' + file;
    const stat = statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFilesInDir(file));
    } else {
      results.push(file);
    }
  }

  return results;
}

console.clear();
await cli();
