#!/usr/bin/env node
import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';

import {findTestedFiles} from './filesystem-utils';
import {promptConceptSelection, promptDifficultySelection} from './prompt';
import {writeFileSync} from 'fs';
import {generateSource, process} from './typescript-utils';

export type Mode = {
  EASY: 'easy';
  HARD: 'hard';
};

export type Concept = {
  path: string;
  name: string;
};

async function run() {
  await intro();

  const allConcepts: Concept[] = fetchConcepts();

  const concept: Concept = await promptConceptSelection(allConcepts);
  const difficulty: Mode = await promptDifficultySelection();

  console.log(
    `We will be practicing ${chalk.bold(concept!.name)} in ${chalk.bold(
      difficulty
    )} mode today!`
  );

  const source = generateSource(concept.path);

  const processed = process(source, true, true, true); // TODO: make this dynamic

  writeFileSync(concept.path, processed);
}

async function intro() {
  console.clear();

  const greeting: string = `
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

  const intro: chalkAnimation.Animation = chalkAnimation.neon(greeting, 1.5);

  await new Promise(r => setTimeout(r, 2000));

  intro.stop();
}

function fetchConcepts(): Concept[] {
  const files: string[] = findTestedFiles('./src', ['.ts']);

  const concepts: Concept[] = files.map((file: string) => createConcept(file));

  return concepts;
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

run();
