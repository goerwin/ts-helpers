const fs = require('fs-extra');
const path = require('path');

function getChildFolders(folderPath, options = {}) {
  let childFolders;

  try {
    childFolders = fs.readdirSync(folderPath)
      .filter(el => fs.statSync(path.join(folderPath, el)).isDirectory())
      .map(el => path.join(folderPath, el));
  } catch (err) {
    childFolders = [];
  }

  if (!options.recursive) return childFolders;
  return childFolders
          .reduce((result, el) => result.concat(getChildFolders(el, options)), childFolders);
}

function getChildFiles(folderPath, options = {}) {
  let childFiles;

  try {
    const folderContent = fs.readdirSync(folderPath);
    childFiles = folderContent
      .filter(el => fs.statSync(path.join(folderPath, el)).isFile())
      .map(el => path.join(folderPath, el));
  } catch (err) {
    childFiles = [];
  }

  if (!options.recursive) return childFiles;

  return getChildFolders(folderPath, { recursive: true })
    .reduce((result, el) => {
      return result.concat(getChildFiles(el, { recursive: false }));
    }, childFiles);
}

function getFileExtension(filePath) {
  const extParts = filePath.split('/').pop().split('.');
  const lastItem = extParts.pop();
  if (extParts.length === 0) return '';
  return lastItem;
}

function getFileBasename(filePath) {
  const basenameParts = filePath.split('/').pop().split('.');
  const lastItem = basenameParts.pop();
  if (basenameParts.length === 0) return lastItem;
  return basenameParts.join('.');
}

module.exports = {
  getChildFolders,
  getChildFiles,
  getFileExtension,
  getFileBasename
};
