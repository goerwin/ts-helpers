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

export function generateJsonTree(rootPath: string, items: (types.File | types.Directory)[]) {
  const rootPathName = path.basename(rootPath);

  function childrenGenerator(
    item: (types.File | types.Directory),
    parentDirDirs: string[],
    parentDirs: string[],
    siblings: (types.JsonTreeDir | types.JsonTreeFile)[] = []
  ): (types.JsonTreeDir | types.JsonTreeFile)[] {
    if (parentDirs.length === 0) {
      return [
        ...siblings,
        types.isFile(item) ?
          { type: 'file', ...item } : { type: 'directory', children: [], ...item }
      ];
    }

    // Get the new Siblings for newItem
    const newParentPath = parentDirDirs.slice(0, parentDirDirs.length - (parentDirs.length - 1))
      .join('/');
    const newItem = siblings.find(el => el.path === newParentPath);
    const newSiblings = (newItem && newItem.type === 'directory' && newItem.children) || [];

    return [
      ...siblings.filter(el => el.path !== newParentPath),
      {
        type: 'directory',
        name: parentDirs[0],
        path: newParentPath,
        isEmpty: false,
        isIgnored: false,
        children: childrenGenerator(item, parentDirDirs, parentDirs.slice(1), newSiblings)
      }
    ];
  }

  return items
    .map(el => el)
    .sort((item1, item2) => (item1.path < item2.path) ? -1 : 1)
    .reduce((result, item) => {
      const relativefilepath = path.relative(rootPath, item.path);
      const parentDir = path.dirname(relativefilepath);
      const itemname = path.basename(relativefilepath);
      const parentDirDirs = [rootPathName, ...(parentDir === '.' ? [] : parentDir.split('/'))];

      return childrenGenerator(item, parentDirDirs, parentDirDirs, result);
    }, [])[0] as types.JsonTreeDir;
}

export function generateAsciiTree(rootPath: string, items: (types.File | types.Directory)[]) {
  const jsonTree = generateJsonTree(rootPath, items);

  function childrenTree(
    children: (types.JsonTreeDir | types.JsonTreeFile)[],
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

    const child = children[0];
    let childrensChildren: (types.JsonTreeDir | types.JsonTreeFile)[];
    let name;

    if (child.type === 'file') {
      name = child.base;
      childrensChildren = [];

      if (child.isIgnored) { name += ' /fileIgnored'; }
    } else {
      name = child.name;
      childrensChildren = child.children;

      if (child.isEmpty) { name += ' /emptyDirectory'; }
      if (child.isIgnored) { name += ' /directoryIgnored'; }
    }

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

  if (!jsonTree || !(jsonTree.type === 'directory')) { return null; }

  return `${jsonTree.name}${childrenTree(jsonTree.children)}`;
}
