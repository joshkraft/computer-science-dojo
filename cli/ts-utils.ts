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
  const linesToDrop: Set<number> = new Set<number>();

  ts.forEachChild(source, node => {
    if (clearMethods && ts.isClassDeclaration(node)) {
      for (const line of findLinesInMethod(source, node)) {
        linesToDrop.add(line);
      }
    }

    if (clearFunctions && ts.isFunctionDeclaration(node)) {
      for (const line of findFunctionLines(source, node)) {
        linesToDrop.add(line);
      }
    }

    if (clearDocumentation) {
      for (const line of findCommentLines(source, node)) {
        linesToDrop.add(line);
      }
    }
  });

  return dropLines(source, linesToDrop);
}

function findLinesInMethod(
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

function findCommentLines(source: ts.SourceFile, node: ts.Node): number[] {
  const lines: number[] = [];
  const ranges = findCommentRanges(source, node) || [];

  for (const range of ranges) {
    const start: number = source.getLineAndCharacterOfPosition(range.pos).line;
    const stop: number = source.getLineAndCharacterOfPosition(range.end).line;

    lines.push(...getRange(start, stop + 1));
  }

  return lines;
}

function findCommentRanges(
  source: ts.SourceFile,
  node: ts.Node
): ts.CommentRange[] {
  const commentRanges = ts.getLeadingCommentRanges(
    source.getFullText(),
    node.getFullStart()
  );

  return commentRanges || [];
}

function dropLines(source: ts.SourceFile, linesToDrop: Set<number>): string {
  return source.text
    .split('\n')
    .filter((element, index) => !linesToDrop.has(index))
    .join('\n');
}

function getRange(start: number, stop: number): number[] {
  const out: number[] = [];

  for (let i = start; i < stop; i++) {
    out.push(i);
  }

  return out;
}
