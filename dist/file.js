"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
function isFile(dirPath, relPath, name) {
    try {
        // Broken symlinks can make this throw so that's why the try/catch
        return fs.statSync(path.join(dirPath, relPath, name)).isFile();
    }
    catch (err) {
        return false;
    }
}
function isDirectory(dirPath, relPath, name) {
    try {
        // Broken symlinks can make this throw so that's why the try/catch
        return fs.statSync(path.join(dirPath, relPath, name)).isDirectory();
    }
    catch (err) {
        return false;
    }
}
function getChildDirs(dirPath, options = {}) {
    options.ignoreDirs = (options.ignoreDirs && options.ignoreDirs.map(path.normalize)) || [];
    // Remove trailing /
    const ignoreDirs = options.ignoreDirs
        .map(el => el[el.length - 1] === '/' ? el.substring(0, el.length - 1) : el);
    const getRecursive = (relPath = '') => {
        let childDirs;
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
        }
        catch (err) {
            childDirs = [];
        }
        if (!options.recursive) {
            return childDirs;
        }
        return childDirs.reduce((result, el) => {
            if (el.isIgnored) {
                return result;
            }
            return result.concat(getRecursive(el.path));
        }, childDirs);
    };
    return getRecursive();
}
exports.getChildDirs = getChildDirs;
function getChildFiles(dirPath, options = {}) {
    options.ignoreFiles = (options.ignoreFiles && options.ignoreFiles.map(path.normalize)) || [];
    const ignoreFiles = options.ignoreFiles;
    const getRecursive = (relPath = '') => {
        let childFiles;
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
        }
        catch (err) {
            childFiles = [];
        }
        if (!options.recursive) {
            return childFiles;
        }
        return getChildDirs(dirPath, Object.assign({}, options, { recursive: true }))
            .reduce((result, el) => {
            if (el.isIgnored) {
                return result;
            }
            options.recursive = false;
            return result.concat(getRecursive(el.path));
        }, childFiles);
    };
    return getRecursive();
}
exports.getChildFiles = getChildFiles;
