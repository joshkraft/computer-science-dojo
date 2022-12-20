export class StringSearch {
  static findSubstring(str: string, substr: string): number[][] {
    const matches: number[][] = [];

    const strLength: number = str.length;
    const substrLength: number = substr.length;

    for (let i = 0; i < strLength - substrLength; i++) {
      let matchLength = 0;

      while (
        matchLength < substrLength &&
        str[i + matchLength] === substr[matchLength]
      ) {
        matchLength++;
      }

      if (matchLength === substrLength) {
        matches.push([i, i + substrLength - 1]);
      }
    }

    return matches;
  }
}
