"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
function getChildDirs(dirPath, options = {}) {
    options.ignoreDirs = (options.ignoreDirs && options.ignoreDirs.map(path.normalize)) || [];
    const ignoreDirs = options.ignoreDirs;
    const getRecursive = (relPath = '') => {
        let childDirs;
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
