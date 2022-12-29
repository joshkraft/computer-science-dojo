import inquirer from 'inquirer';
import {Concept, Mode} from './types';

export async function promptConceptSelection(
  concepts: Concept[]
): Promise<Concept> {
  const RANDOM_MODE: string = 'Random Concept';

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

  return match!;
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
