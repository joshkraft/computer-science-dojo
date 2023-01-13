import inquirer, {ChoiceOptions} from 'inquirer';
import {Mode, Concept} from './cli';

export async function promptConceptSelection(
  concepts: Concept[]
): Promise<Concept> {
  const RANDOM_MODE: string = 'Random Concept';
  const choices: ChoiceOptions[] = [];

  choices.push({
    name: RANDOM_MODE,
    value: RANDOM_MODE,
  });

  for (const concept of concepts) {
    choices.push({
      name: concept.name,
      value: concept,
    });
  }

  const result = await inquirer.prompt({
    name: 'concept',
    type: 'list',
    message: 'What concept would you like to practice today?\n',
    choices: choices,
  });

  if (result.concept === RANDOM_MODE) {
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  return result.concept;
}

export async function promptDifficultySelection(): Promise<Mode> {
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
