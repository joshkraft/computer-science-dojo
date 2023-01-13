import {readFileSync} from 'fs';
import typescript from 'typescript';

export function generateSource(path: string): typescript.SourceFile {
  let className = path.split('/')[path.split('/').length - 1].slice(0, -3);

  className = className.charAt(0).toUpperCase() + className.slice(1);

  const file = readFileSync(path, 'utf-8');

  const source: typescript.SourceFile = typescript.createSourceFile(
    path,
    file,
    typescript.ScriptTarget.Latest
  );

  return source;
}

export function process(
  source: typescript.SourceFile,
  clearMethods: boolean,
  clearFunctions: boolean,
  clearComments: boolean
): string {
  const linesToDrop: Set<Number> = new Set<Number>();

  typescript.forEachChild(source, node => {
    if (clearMethods && typescript.isClassDeclaration(node)) {
      const methods: typescript.ClassElement[] = node.members.filter(member =>
        typescript.isMethodDeclaration(member)
      );

      for (const method of methods) {
        const start: number = source.getLineAndCharacterOfPosition(
          method.getStart(source)
        ).line;

        const stop: number = source.getLineAndCharacterOfPosition(
          method.getEnd()
        ).line;

        for (let i = start + 1; i < stop; i++) {
          linesToDrop.add(i);
        }

        if (clearComments) {
          const commentRanges = findCommentRanges(source, method) || [];
          for (const range of commentRanges) {
            const start: number = source.getLineAndCharacterOfPosition(
              range.pos
            ).line;

            const stop: number = source.getLineAndCharacterOfPosition(
              range.end
            ).line;

            for (let i = start; i <= stop; i++) {
              linesToDrop.add(i);
            }
          }
        }
      }
    }

    if (clearFunctions && typescript.isFunctionDeclaration(node)) {
      const start = source.getLineAndCharacterOfPosition(
        node.getStart(source)
      ).line;

      const stop = source.getLineAndCharacterOfPosition(node.getEnd()).line;

      for (let i = start + 1; i < stop; i++) {
        linesToDrop.add(i);
      }

      if (clearComments) {
        const commentRanges = findCommentRanges(source, node) || [];
        for (const range of commentRanges) {
          const start: number = source.getLineAndCharacterOfPosition(
            range.pos
          ).line;

          const stop: number = source.getLineAndCharacterOfPosition(
            range.end
          ).line;

          for (let i = start; i <= stop; i++) {
            linesToDrop.add(i);
          }
        }
      }
    }
  });

  const allLines: string[] = source.text.split('\n');
  const selectedLines: string[] = [];

  for (let i = 0; i < allLines.length; i++) {
    if (!linesToDrop.has(i)) {
      selectedLines.push(allLines[i]);
    }
  }

  return selectedLines.join('\n');
}

export function findCommentRanges(
  source: typescript.SourceFile,
  node: typescript.Node
): typescript.CommentRange[] {
  const commentRanges = typescript.getLeadingCommentRanges(
    source.getFullText(),
    node.getFullStart()
  );

  return commentRanges || [];
}
