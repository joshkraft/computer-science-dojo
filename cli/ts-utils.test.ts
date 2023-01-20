import ts from 'typescript';
import {modifySource} from './ts-utils';

describe('ts-utils', () => {
  describe('modifySource()', () => {
    test('should be able to clear out methods in TypeScript file', () => {
      const source = ts.createSourceFile('', testClass, ts.ScriptTarget.Latest);

      const expected = `
class AClass {
	constructor(foo: string) {
		this.foo = foo;
	}

	/**
	 * aMethod prints foo to the console.
	 */
	aMethod(foo: string) {
	}
}`;

      expect(modifySource(source, true)).toEqual(expected);
    });

    test('should be able to clear out functions in TypeScript file', () => {
      const source = ts.createSourceFile(
        '',
        testFunction,
        ts.ScriptTarget.Latest
      );

      const expected = `
/**
 * aFunction prints foo and bar to the console.
 */
function aFunction(foo: string, bar: string) {
}`;

      expect(modifySource(source, false, true)).toEqual(expected);
    });

    test('should be able to clear out comments in TypeScript file', () => {
      const source = ts.createSourceFile(
        '',
        testComments,
        ts.ScriptTarget.Latest
      );

      const expected = '\n\n';

      expect(modifySource(source, false, false, true)).toEqual(expected);
    });
  });
});

const testClass = `
class AClass {
	constructor(foo: string) {
		this.foo = foo;
	}

	/**
	 * aMethod prints foo to the console.
	 */
	aMethod(foo: string) {
		console.log(foo);
	}
}`;

const testFunction = `
/**
 * aFunction prints foo and bar to the console.
 */
function aFunction(foo: string, bar: string) {
	console.log(foo);
	console.log(bar);
}`;

const testComments = `
// a single line comment

/**
 * a multi line comment
 */
`;
