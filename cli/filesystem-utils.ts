import {readdirSync, statSync} from 'fs';

export function findTestedFiles(
  dir: string,
  extensions: string[],
  testPattern: string = 'test'
): string[] {
  let files: string[] = explore(dir);

  files = filterExtension(files, extensions);
  files = filterIsTested(files, testPattern);

  return files;
}

function explore(dir: string): string[] {
  const out: string[] = [];
  const nodes: string[] = readdirSync(dir);

  for (const node of nodes) {
    const path: string = dir + '/' + node;
    const isDir: boolean = statSync(path).isDirectory();

    if (isDir) {
      out.push(...explore(path));
      continue;
    }

    out.push(path);
  }

  return out;
}

function filterExtension(files: string[], extensions: string[]): string[] {
  return files.filter(file => {
    return extensions.includes(file.slice(file.lastIndexOf('.')));
  });
}

function filterIsTested(files: string[], testPattern: string): string[] {
  const testFiles: Set<string> = new Set(
    files
      .filter(file => file.includes(testPattern))
      .map(
        file =>
          file
            .split('/')
            .filter(substr => substr.includes(testPattern))[0]
            .split('.')[0]
      )
  );

  return files.filter(file => {
    return (
      !file.includes(testPattern) &&
      testFiles.has(file.slice(file.lastIndexOf('/') + 1).split('.')[0])
    );
  });
}
