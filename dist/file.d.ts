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
export declare function getChildDirs(dirPath: string, options?: FileDirOptions): Directory[];
export declare function getChildFiles(dirPath: string, options?: FileDirOptions): File[];
