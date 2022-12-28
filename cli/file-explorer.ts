import {readdirSync, statSync} from 'fs';

export class FileExplorer {
  public static findMatchingFiles(
    dir: string,
    inclusions: string[],
    exclusions: string[] = []
  ): string[] {
    let files: string[] = this.exploreDir(dir);

    files = files.filter(file => {
      return inclusions.some(inclusion => file.includes(inclusion));
    });

    files = files.filter(file => {
      return !exclusions.some(exclusion => file.includes(exclusion));
    });

    return files;
  }

  private static exploreDir(dir: string): string[] {
    const out: string[] = [];
    const nodes: string[] = readdirSync(dir);

    for (const node of nodes) {
      const path: string = dir + '/' + node;
      const isDir: boolean = statSync(path).isDirectory();

      if (isDir) {
        out.push(...this.exploreDir(path));
        continue;
      }

      out.push(path);
    }

    return out;
  }
}
