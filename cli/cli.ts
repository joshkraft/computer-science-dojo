#!/usr/bin/env node
/**
 * TODO:
 * [ ] clean everything up
 * [ ] actually clear out the file (or not?)
 * [ ] open the file in vscode
 * [ ] start a test session?
 * [ ] consider adding functionality to group by category?
 * [ ] add logic to filter out utilities, such as requiring test files?
 * [ ] implement DIY fuzzy finding? or DIY cli altogether?
 */
import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import {FileExplorer} from './file-explorer';
import {Concept} from './concept';

async function main() {
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
  const intro = chalkAnimation.neon('\nWELCOME TO CS DOJO!!!\n', 2);

  await new Promise(r => setTimeout(r, 2000));

  intro.stop();
}

async function promptConceptSelection(concepts: Concept[]): Promise<Concept> {
  const selection = await inquirer.prompt({
    name: 'problem',
    type: 'list',
    message: 'What concept would you like to practice today?\n',
    choices: [RANDOM_MODE, ...concepts.map((concept: Concept) => concept.name)],
  });

  if (selection.problem === RANDOM_MODE) {
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  const match: Concept | undefined = concepts.find(
    (c: Concept) => c.name === selection.problem
  );

  if (!match) {
    throw new Error('Unable to find selected concept');
  }

  return match;
}

async function promptDifficultySelection(): Promise<Mode> {
  const selection = await inquirer.prompt({
    name: 'mode',
    type: 'list',
    message: 'What difficulty would you like?\n',
    choices: [
      {
        name: 'Easy (Delete method bodies)',
        value: 'Easy',
      },
      {
        name: 'Hard (Delete method bodies and JSDocs)',
        value: 'Hard',
      },
    ],
  });

  return selection.mode;
}

function fetchConcepts(): Concept[] {
  const files: string[] = FileExplorer.findMatchingFiles(
    './src',
    ['.ts'],
    ['.test.']
  );

  return files.map(file => new Concept(file));
}

const RANDOM_MODE: string = 'Random Concept';

type Mode = {
  EASY: 'easy';
  HARD: 'hard';
};

console.clear();
main();
