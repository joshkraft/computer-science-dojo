#!/usr/bin/env node
import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';

import ts from 'typescript';
import {writeFileSync} from 'fs';
import * as cp from 'child_process';

import {getSourceFile, modifySource} from './ts-utils';
import {findTestedFiles, createConcept} from './file';
import {selectConcept, selectDifficulty} from './prompt';

export enum Mode {
  EASY = 'easy',
  HARD = 'hard',
}

export type Concept = {
  path: string;
  name: string;
};

export async function main(): Promise<void> {
  await displayIntro();

  const concepts: Concept[] = fetchConcepts();

  const selectedConcept: Concept = await selectConcept(concepts);
  const selectedDifficulty: Mode = await selectDifficulty();

  console.log(
    `We will be practicing ${chalk.bold(selectedConcept!.name)} in ${chalk.bold(
      selectedDifficulty
    )} mode today!`
  );

  prepareConcept(selectedConcept, selectedDifficulty);

  console.log('Launching editor...');

  cp.exec(`code ${selectedConcept.path}`);
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

function prepareConcept(
  selectedConcept: Concept,
  selectedDifficulty: Mode
): void {
  const source: ts.SourceFile = getSourceFile(selectedConcept.path);
  const clearDocumentation = selectedDifficulty.toLowerCase() === Mode.HARD;

  const modifiedFile: string = modifySource(
    source,
    true,
    true,
    clearDocumentation
  );

  writeFileSync(selectedConcept.path, modifiedFile);
}

main();
