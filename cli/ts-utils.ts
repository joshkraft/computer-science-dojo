import {readFileSync} from 'fs';
import ts from 'typescript';

export function getSourceFile(path: string): ts.SourceFile {
  const file: string = readFileSync(path, 'utf-8');
  return ts.createSourceFile(path, file, ts.ScriptTarget.Latest);
}

export function modifySource(
  source: ts.SourceFile,
  clearMethods = false,
  clearFunctions = false,
  clearDocumentation = false
): string {
  const linesToRemove: Set<number> = new Set<number>();

  ts.forEachChild(source, node => {
    if (clearMethods && ts.isClassDeclaration(node)) {
      for (const line of findMethodLines(source, node)) {
        linesToRemove.add(line);
      }
    }

    if (clearFunctions && ts.isFunctionDeclaration(node)) {
      for (const line of findFunctionLines(source, node)) {
        linesToRemove.add(line);
      }
    }
  });

  if (clearDocumentation) {
    for (const line of findCommentLines(source)) {
      linesToRemove.add(line);
    }
  }

  return removeLines(source, linesToRemove);
}

function findMethodLines(
  source: ts.SourceFile,
  node: ts.ClassDeclaration
): number[] {
  const lines: number[] = [];

  const methods: ts.ClassElement[] = node.members.filter(member =>
    ts.isMethodDeclaration(member)
  );

  for (const method of methods) {
    const start: number = source.getLineAndCharacterOfPosition(
      method.getStart(source)
    ).line;
    const stop: number = source.getLineAndCharacterOfPosition(
      method.getEnd()
    ).line;

    lines.push(...getRange(start + 1, stop));
  }

  return lines;
}

function findFunctionLines(
  source: ts.SourceFile,
  node: ts.FunctionDeclaration
): number[] {
  const start: number = source.getLineAndCharacterOfPosition(
    node.getStart(source)
  ).line;

  const stop: number = source.getLineAndCharacterOfPosition(node.getEnd()).line;

  return getRange(start + 1, stop);
}

function findCommentLines(source: ts.SourceFile): number[] {
  const commentLines: number[] = [];

  const lines = source.getFullText().split('\n');

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();
    const isComment = trimmed.startsWith('/') || trimmed.startsWith('*');

    if (isComment) {
      commentLines.push(i);
    }
  }

  return commentLines;
}

function removeLines(
  source: ts.SourceFile,
  linesToRemove: Set<number>
): string {
  return source
    .getFullText()
    .split('\n')
    .filter((element, index) => !linesToRemove.has(index))
    .join('\n');
}

function getRange(start: number, stop: number): number[] {
  const out: number[] = [];

  for (let i = start; i < stop; i++) {
    out.push(i);
  }

  return out;
}
