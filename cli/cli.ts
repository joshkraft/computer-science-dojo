#!/usr/bin/env node
import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';

import {findTestedFiles} from './file';
import {Concept, Mode} from './types';
import {promptConceptSelection, promptDifficultySelection} from './prompt';

async function cli() {
  await intro();

  const concepts: Concept[] = fetchConcepts();

  const selectedConcept: Concept = await promptConceptSelection(concepts);
  const selectedDifficulty: Mode = await promptDifficultySelection();

  console.log(
    `We will be practicing ${chalk.bold(selectedConcept!.name)} in ${chalk.bold(
      selectedDifficulty
    )} mode today!`
  );
}

async function intro() {
  console.clear();

  const intro = chalkAnimation.neon('\nWELCOME TO CS DOJO!!!\n', 2);

  await new Promise(r => setTimeout(r, 2000));

  intro.stop();
}

function fetchConcepts(): Concept[] {
  const files: string[] = findTestedFiles('./src', ['.ts']);

  const concepts: Concept[] = [];
  for (const file of files) {
    concepts.push(createConcept(file));
  }

  return concepts;
}

function createConcept(file: string): Concept {
  const path = file;
  const name = file
    .slice(file.lastIndexOf('/') + 1)
    .split('.')[0]
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  return {path, name};
}

cli();
