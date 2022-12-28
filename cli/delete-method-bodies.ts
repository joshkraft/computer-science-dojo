import {readFileSync, writeFileSync} from 'fs';
import typescript from 'typescript';

if (process.argv.indexOf('filepath') === -1) {
  console.error('Please provide a file path to practice');
  process.exit(1);
}

const filePath = process.argv[process.argv.indexOf('filepath') + 1];

let className = filePath
  .split('/')
  [filePath.split('/').length - 1].slice(0, -3);
className = className.charAt(0).toUpperCase() + className.slice(1);

const rawFile = readFileSync(filePath, 'utf-8');

const sourceFile: typescript.SourceFile = typescript.createSourceFile(
  filePath,
  rawFile,
  typescript.ScriptTarget.Latest
);

const linesToDrop = new Set();

typescript.forEachChild(sourceFile, node => {
  if (typescript.isClassDeclaration(node) && node.name?.text === className) {
    const methods = node.members.filter(member =>
      typescript.isMethodDeclaration(member)
    );

    for (const method of methods) {
      const startLine = sourceFile.getLineAndCharacterOfPosition(
        method.getStart(sourceFile)
      ).line;

      const stopLine = sourceFile.getLineAndCharacterOfPosition(
        method.getEnd()
      ).line;

      for (let i = startLine + 1; i < stopLine; i++) {
        linesToDrop.add(i);
      }
    }
  }
});

const allLines = rawFile.split('\n');
const selectedLines = [];

for (let i = 0; i < allLines.length; i++) {
  if (!linesToDrop.has(i)) {
    selectedLines.push(allLines[i]);
  }
}

writeFileSync(filePath, selectedLines.join('\n'));
