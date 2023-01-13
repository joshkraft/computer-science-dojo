import typescript from 'typescript';
import {process} from './typescript-utils';

describe('TypeScript Utils', () => {
  test('should be able to delete method bodies', () => {
    const input = createSourceFromString(testClass);

    const result = process(input, true, false, false);

    const expected = `
class TestClass {
	constructor(foo: string) {
		this.foo = foo;
	}

	/**
	 * Test Comment
	 */
	testMethod(foo: string) {
	}
}
`;

    expect(result).toBe(expected);
  });

  test('should be able to delete function bodies', () => {
    const input = createSourceFromString(testFunction);

    const result = process(input, false, true, false);

    const expected = `
/**
 * Test Comment
 */
function testFunction(foo: string) {
}
`;

    expect(result).toBe(expected);
  });

  test('should be able to delete comments', () => {
    const input = createSourceFromString(
      testClass + '\n' + testFunction + '\n' + testStandaloneComment
    );

    const result = process(input, true, true, true);

    const expected = `
class TestClass {
	constructor(foo: string) {
		this.foo = foo;
	}

	testMethod(foo: string) {
	}
}


function testFunction(foo: string) {
}


// test standalone comment
`;

    expect(result).toBe(expected);
  });
});

function createSourceFromString(str: string): typescript.SourceFile {
  return typescript.createSourceFile('', str, typescript.ScriptTarget.Latest);
}

const testClass: string = `
class TestClass {
	constructor(foo: string) {
		this.foo = foo;
	}

	/**
	 * Test Comment
	 */
	testMethod(foo: string) {
		console.log(foo);
	}
}
`;

const testFunction: string = `
/**
 * Test Comment
 */
function testFunction(foo: string) {
	console.log(foo);
}
`;

const testStandaloneComment: string = `
// test standalone comment
`;
