import * as fs from 'fs';
import * as path from 'path';
import * as types from './types';

function isFile(dirPath: string, relPath: string, name: string) {
  try {
    // Broken symlinks can make this throw so that's why the try/catch
    return fs.statSync(path.join(dirPath, relPath, name)).isFile();
  } catch (err) {
    return false;
  }
}

function isDirectory(dirPath: string, relPath: string, name: string) {
  try {
    // Broken symlinks can make this throw so that's why the try/catch
    return fs.statSync(path.join(dirPath, relPath, name)).isDirectory();
  } catch (err) {
    return false;
  }
}

export function getChildDirs(dirPath: string, options: types.FileDirOptions = {}) {
  options.ignoreDirs = (options.ignoreDirs && options.ignoreDirs.map(path.normalize)) || [];

  // Remove trailing /
  const ignoreDirs = options.ignoreDirs
    .map(el => el[el.length - 1] === '/' ? el.substring(0, el.length - 1) : el);

  const getRecursive = (relPath = ''): types.Directory[] => {
    let childDirs: types.Directory[];

    try {
      childDirs = fs.readdirSync(path.join(dirPath, relPath))
        .filter(el => isDirectory(dirPath, relPath, el))
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

export function getChildFiles(dirPath: string, options: types.FileDirOptions = {}) {
  options.ignoreFiles = (options.ignoreFiles && options.ignoreFiles.map(path.normalize)) || [];
  const ignoreFiles = options.ignoreFiles;

  const getRecursive = (relPath = ''): types.File[] => {
    let childFiles: types.File[];

    try {
      const dirContent = fs.readdirSync(path.join(dirPath, relPath));
      childFiles = dirContent
        .filter(el => isFile(dirPath, relPath, el))
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

export function generateJsonTree(rootPath: string, files: string[]) {
  files = [...files];
  files.sort();

  const rootPathName = path.basename(rootPath);

  return files
    .map(file => path.relative(rootPath, file))
    .reduce((result, file) => {
      const parentDir = path.dirname(file);
      const filename = path.basename(file);
      const parentDirDirs = [rootPathName, ...(parentDir === '.' ? [] : parentDir.split('/'))];

      function childrenGenerator(
        parentDirs: string[],
        siblings: types.JsonTreeItem[] = []
      ): types.JsonTreeItem[] {
        if (parentDirs.length === 0) {
          return [...siblings, { name: filename, path: path.join(rootPathName, file) }];
        }

        const fpath = parentDirDirs.slice(0, parentDirDirs.length - (parentDirs.length - 1))
          .join('/');

        const item = siblings.find(el => el.path === fpath);
        const newSiblings = (item && item.children) || [];

        return [
          ...siblings.filter(el => el.path !== fpath),
          {
            name: parentDirs[0],
            path: fpath,
            children: childrenGenerator(parentDirs.slice(1), newSiblings)
          }
        ];
      }

      return childrenGenerator(parentDirDirs, result);
    }, [])[0];
}

export function generateAsciiTree(rootPath: string, files: string[]) {
  const jsonTree = generateJsonTree(rootPath, files);

  function childrenTree(
    children: types.JsonTreeItem[],
    levels = 0,
    continuationPipeLevels: number[] = []
  ): string {
    if (children.length === 0) { return ''; }

    let separator = '├──';
    if (children.length === 1) { separator = '└──'; }

    let levelsSpaces = '';
    if (levels > 0) {
      for (let i = 0; i < levels * 4; i += 1) { levelsSpaces += ' '; }

      continuationPipeLevels.forEach(level => {
        const idx = level * 4;
        levelsSpaces = levelsSpaces.substring(0, idx) + '│' + levelsSpaces.substring(idx + 1);
      });
    }

    const name = children[0].name;
    const childrensChildren = children[0].children || [];

    const childrensChildrenTree = childrenTree(
      childrensChildren,
      levels + 1,
      [
        ...continuationPipeLevels,
        ...((children.length > 1 && childrensChildren.length) ? [levels] : [])
      ]
    );

    return (
      `\n${levelsSpaces}${separator} ${name}` +
      `${childrensChildrenTree}` +
      `${childrenTree(children.slice(1), levels, continuationPipeLevels)}`
    );
  }

  if (!jsonTree || !jsonTree.children) { return null; }

  return `${jsonTree.name}${childrenTree(jsonTree.children)}`;
}
