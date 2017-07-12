declare namespace Types {
    interface FileDirOptions {
        ignoreDirs?: string[];
        ignoreFiles?: string[];
        recursive?: boolean;
    }
    interface Directory {
        name: string;
        path: string;
        isIgnored: boolean;
        isEmpty: boolean;
    }
    interface File {
        name: string;
        base: string;
        ext: string;
        path: string;
        isIgnored: boolean;
    }
}
