const fs = require('fs-extra');
const path = require('path');

function getChildDirs(dirPath, options = {}) {
  let childDirs;

  try {
    childDirs = fs.readdirSync(dirPath)
      .filter(el => fs.statSync(path.join(dirPath, el)).isDirectory())
      .map(el => path.join(dirPath, el));
  } catch (err) {
    childDirs = [];
  }

  if (!options.recursive) return childDirs;
  return childDirs.reduce((result, el) => result.concat(getChildDirs(el, options)), childDirs);
}

function getChildFiles(dirPath, options = {}) {
  let childFiles;

  try {
    const dirContent = fs.readdirSync(dirPath);
    childFiles = dirContent
      .filter(el => fs.statSync(path.join(dirPath, el)).isFile())
      .map(el => path.join(dirPath, el));
  } catch (err) {
    childFiles = [];
  }

  if (!options.recursive) return childFiles;

  return getChildDirs(dirPath, { recursive: true })
    .reduce((result, el) => {
      return result.concat(getChildFiles(el, { recursive: false }));
    }, childFiles);
}

module.exports = {
  getChildDirs,
  getChildFiles
};
