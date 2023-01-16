import {readdirSync, statSync} from 'fs';
import {Concept} from './cli';

export function findTestedFiles(
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

export function createConcept(file: string): Concept {
  const path: string = file;
  const name: string = file
    .slice(file.lastIndexOf('/') + 1)
    .split('.')[0]
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  return {path, name};
}
