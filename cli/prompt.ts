import inquirer, {ChoiceOptions} from 'inquirer';
import {Concept, Mode} from './cli';

export async function selectConcept(concepts: Concept[]): Promise<Concept> {
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

export async function selectDifficulty(): Promise<Mode> {
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
