import * as fs from 'fs-extra';
import * as path from 'path';
import './types';

export function getChildDirs(dirPath: string, options: Types.FileDirOptions = {}) {
  options.ignoreDirs = (options.ignoreDirs && options.ignoreDirs.map(path.normalize)) || [];
  const ignoreDirs = options.ignoreDirs;

  const getRecursive = (relPath = ''): Types.Directory[] => {
    let childDirs: Types.Directory[];

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

export function getChildFiles(dirPath: string, options: Types.FileDirOptions = {}) {
  options.ignoreFiles = (options.ignoreFiles && options.ignoreFiles.map(path.normalize)) || [];
  const ignoreFiles = options.ignoreFiles;

  const getRecursive = (relPath = ''): Types.File[] => {
    let childFiles: Types.File[];

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
