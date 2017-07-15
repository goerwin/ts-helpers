import * as fs from 'fs-extra';
import * as path from 'path';

export interface FileDirOptions {
  ignoreDirs?: string[];
  ignoreFiles?: string[];
  recursive?: boolean;
}

export interface Directory {
  name: string;
  path: string;
  isIgnored: boolean;
  isEmpty: boolean;
}

export interface File {
  name: string;
  base: string;
  ext: string;
  path: string;
  isIgnored: boolean;
}

export function getChildDirs(dirPath: string, options: FileDirOptions = {}) {
  options.ignoreDirs = (options.ignoreDirs && options.ignoreDirs.map(path.normalize)) || [];

  // Remove trailing /
  const ignoreDirs = options.ignoreDirs
    .map(el => el[el.length - 1] === '/' ? el.substring(0, el.length - 1) : el);

  const getRecursive = (relPath = ''): Directory[] => {
    let childDirs: Directory[];

    try {
      childDirs = fs.readdirSync(path.join(dirPath, relPath))
        .filter(el => fs.statSync(path.join(dirPath, relPath, el)).isDirectory())
        .map(el => {
          const relativePath = path.normalize(path.join(relPath, el));

          return {
            name: el,
            path: relativePath,
            isIgnored: ignoreDirs.includes(relativePath),
            isEmpty: fs.readdirSync(path.join(dirPath, relPath, el)).length === 0
          };
        });
    } catch (err) {
      childDirs = [];
    }

    if (!options.recursive) { return childDirs; }

    return childDirs.reduce((result, el) => {
      if (el.isIgnored) { return result; }

      return result.concat(getRecursive(el.path));
    }, childDirs);
  };

  return getRecursive();
}

export function getChildFiles(dirPath: string, options: FileDirOptions = {}) {
  options.ignoreFiles = (options.ignoreFiles && options.ignoreFiles.map(path.normalize)) || [];
  const ignoreFiles = options.ignoreFiles;

  const getRecursive = (relPath = ''): File[] => {
    let childFiles: File[];

    try {
      const dirContent = fs.readdirSync(path.join(dirPath, relPath));
      childFiles = dirContent
        .filter(el => fs.statSync(path.join(dirPath, relPath, el)).isFile())
        .map(el => {
          const { name, base, ext } = path.parse(path.join(dirPath, el));
          const relativePath = path.normalize(path.join(relPath, el));

          return {
            name,
            base,
            ext,
            path: relativePath,
            isIgnored: ignoreFiles.includes(relativePath)
          };
        });
    } catch (err) {
      childFiles = [];
    }

    if (!options.recursive) { return childFiles; }

    return getChildDirs(dirPath, { ...options, recursive: true })
      .reduce((result, el) => {
        if (el.isIgnored) { return result; }

        options.recursive = false;
        return result.concat(getRecursive(el.path));
      }, childFiles);
  };

  return getRecursive();
}
