export class Concept {
  path: string;
  name: string;

  constructor(path: string) {
    this.path = path;
    this.name = this.extractName(path);
  }

  extractName(path: string): string {
    const rawName: string = path.slice(path.lastIndexOf('/') + 1).split('.')[0];

    const formattedName: string[] = rawName
      .split('-')
      .map((word: string) => word[0].toUpperCase() + word.slice(1));

    return formattedName.join(' ');
  }
}
