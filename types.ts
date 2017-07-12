namespace Types {
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
}
