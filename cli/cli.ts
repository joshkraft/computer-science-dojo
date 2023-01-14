#!/usr/bin/env node
import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';

import {readdirSync, readFileSync, statSync, writeFileSync} from 'fs';
import inquirer, {ChoiceOptions} from 'inquirer';
import ts from 'typescript';

enum Mode {
  EASY,
  HARD,
}

type Concept = {
  path: string;
  name: string;
};

async function main(): Promise<void> {
  await displayIntro();

  const concepts: Concept[] = fetchConcepts();

  const selectedConcept: Concept = await promptConceptSelection(concepts);
  const selectedDifficulty: Mode = await promptDifficultySelection();

  console.log(
    `We will be practicing ${chalk.bold(selectedConcept!.name)} in ${chalk.bold(
      selectedDifficulty
    )} mode today!`
  );

  transformConceptFile(selectedConcept, selectedDifficulty);
}

async function displayIntro(): Promise<void> {
  const greeting = `
  __        __   _                            _        
  \\ \\      / /__| | ___ ___  _ __ ___   ___  | |_ ___  
   \\ \\ /\\ / / _ \\ |/ __/ _ \\| '_ \` _ \\ / _ \\ | __/ _ \\ 
    \\ V  V /  __/ | (_| (_) | | | | | |  __/ | || (_) |
     \\_/\\_/ \\___|_|\\___\\___/|_| |_| |_|\\___|  \\__\\___/ 
    ____ ____    ____   ___      _  ___                
   / ___/ ___|  |  _ \\ / _ \\    | |/ _ \\               
  | |   \\___ \\  | | | | | | |_  | | | | |              
  | |___ ___) | | |_| | |_| | |_| | |_| |              
   \\____|____/  |____/ \\___/ \\___/ \\___/               
 `;

  console.clear();
  const intro: chalkAnimation.Animation = chalkAnimation.neon(greeting, 1.5);
  await new Promise(r => setTimeout(r, 2000));
  intro.stop();
}

function fetchConcepts(): Concept[] {
  const files: string[] = findTestedFiles('./src', ['.ts'], 'test');

  return files.map((file: string) => createConcept(file));
}

function findTestedFiles(
  dir: string,
  extensions: string[],
  testPattern: string
): string[] {
  const allFiles: string[] = findFilesInDir(dir);

  const testFiles: Set<string> = findTestFiles(allFiles, testPattern);

  return allFiles.filter(file => {
    return (
      isCorrectExtension(file, extensions) &&
      isTested(file, testPattern, testFiles)
    );
  });
}

function findFilesInDir(dir: string): string[] {
  const out: string[] = [];
  const nodes: string[] = readdirSync(dir);

  for (const node of nodes) {
    const path: string = dir + '/' + node;
    const isDir: boolean = statSync(path).isDirectory();

    if (isDir) {
      out.push(...findFilesInDir(path));
      continue;
    }

    out.push(path);
  }

  return out;
}

function findTestFiles(files: string[], testPattern: string): Set<string> {
  const testFiles: Set<string> = new Set();

  for (const file of files) {
    if (file.includes(testPattern)) {
      testFiles.add(
        file
          .split('/')
          .filter(substr => substr.includes(testPattern))[0]
          .split('.')[0]
      );
    }
  }

  return testFiles;
}

function isCorrectExtension(file: string, extensions: string[]): boolean {
  return extensions.includes(file.slice(file.lastIndexOf('.')));
}

function isTested(
  file: string,
  testPattern: string,
  testFiles: Set<string>
): boolean {
  return (
    !file.includes(testPattern) &&
    testFiles.has(file.slice(file.lastIndexOf('/') + 1).split('.')[0])
  );
}

function createConcept(file: string): Concept {
  const path: string = file;
  const name: string = file
    .slice(file.lastIndexOf('/') + 1)
    .split('.')[0]
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  return {path, name};
}

async function promptConceptSelection(concepts: Concept[]): Promise<Concept> {
  const options: ChoiceOptions[] = [];

  const RANDOM_MODE = 'Random Concept';
  options.push({
    name: RANDOM_MODE,
    value: RANDOM_MODE,
  });

  for (const concept of concepts) {
    options.push({
      name: concept.name,
      value: concept,
    });
  }

  const result = await inquirer.prompt({
    name: 'concept',
    type: 'list',
    message: 'What concept would you like to practice today?\n',
    choices: options,
  });

  if (result.concept === RANDOM_MODE) {
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  return result.concept;
}

async function promptDifficultySelection(): Promise<Mode> {
  const selection = await inquirer.prompt({
    name: 'mode',
    type: 'list',
    message: 'What difficulty would you like?\n',
    choices: [
      {
        name: 'Easy (Delete method/function bodies)',
        value: 'Easy',
      },
      {
        name: 'Hard (Delete method/function bodies and documentation)',
        value: 'Hard',
      },
    ],
  });

  return selection.mode;
}

function transformConceptFile(
  selectedConcept: Concept,
  selectedDifficulty: Mode
): void {
  const source: ts.SourceFile = generateSource(selectedConcept.path);

  const shouldClearMethods: boolean = true;
  const shouldClearFunctions: boolean = true;
  const shouldClearComments: boolean = selectedDifficulty === Mode.HARD;

  const processed = processFile(
    source,
    shouldClearMethods,
    shouldClearFunctions,
    shouldClearComments
  );

  writeFileSync(selectedConcept.path, processed);
}

// TODO: pick up refactoring here
function generateSource(path: string): ts.SourceFile {
  const file: string = readFileSync(path, 'utf-8');
  return ts.createSourceFile(path, file, ts.ScriptTarget.Latest);
}

export function processFile(
  source: ts.SourceFile,
  clearMethods: boolean,
  clearFunctions: boolean,
  clearComments: boolean
): string {
  const linesToDrop: Set<Number> = new Set<Number>();

  ts.forEachChild(source, node => {
    if (clearMethods && ts.isClassDeclaration(node)) {
      const methods: ts.ClassElement[] = node.members.filter(member =>
        ts.isMethodDeclaration(member)
      );

      for (const method of methods) {
        const start: number = source.getLineAndCharacterOfPosition(
          method.getStart(source)
        ).line;

        const stop: number = source.getLineAndCharacterOfPosition(
          method.getEnd()
        ).line;

        for (let i = start + 1; i < stop; i++) {
          linesToDrop.add(i);
        }

        if (clearComments) {
          const commentRanges = findCommentRanges(source, method) || [];
          for (const range of commentRanges) {
            const start: number = source.getLineAndCharacterOfPosition(
              range.pos
            ).line;

            const stop: number = source.getLineAndCharacterOfPosition(
              range.end
            ).line;

            for (let i = start; i <= stop; i++) {
              linesToDrop.add(i);
            }
          }
        }
      }
    }

    if (clearFunctions && ts.isFunctionDeclaration(node)) {
      const start = source.getLineAndCharacterOfPosition(
        node.getStart(source)
      ).line;

      const stop = source.getLineAndCharacterOfPosition(node.getEnd()).line;

      for (let i = start + 1; i < stop; i++) {
        linesToDrop.add(i);
      }

      if (clearComments) {
        const commentRanges = findCommentRanges(source, node) || [];
        for (const range of commentRanges) {
          const start: number = source.getLineAndCharacterOfPosition(
            range.pos
          ).line;

          const stop: number = source.getLineAndCharacterOfPosition(
            range.end
          ).line;

          for (let i = start; i <= stop; i++) {
            linesToDrop.add(i);
          }
        }
      }
    }
  });

  const allLines: string[] = source.text.split('\n');
  const selectedLines: string[] = [];

  for (let i = 0; i < allLines.length; i++) {
    if (!linesToDrop.has(i)) {
      selectedLines.push(allLines[i]);
    }
  }

  return selectedLines.join('\n');
}

function findCommentRanges(
  source: ts.SourceFile,
  node: ts.Node
): ts.CommentRange[] {
  const commentRanges = ts.getLeadingCommentRanges(
    source.getFullText(),
    node.getFullStart()
  );

  return commentRanges || [];
}

// main();
