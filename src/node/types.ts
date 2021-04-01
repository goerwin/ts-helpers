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

export interface ParsePathToOptions {
  isIgnored?: boolean;
  isEmpty?: boolean;
}

export interface JsonTreeFile extends File {
  type: 'file';
}

export interface JsonTreeDir extends Directory {
  type: 'directory';
  children: (JsonTreeFile | JsonTreeDir)[];
}

export function isFile(item: Directory | File): item is File {
  return (<File>item).base !== undefined;
}
