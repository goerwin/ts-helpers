require('../url');
const assert = require('assert');
const fileHelpers = require('../file');
const path = require('path');

describe('file helpers', () => {
  describe('getChildFolders', () => {
    it('should return correct number of folders', () => {
      const folders = fileHelpers.getChildFolders(path.join(__dirname, 'examples'));
      assert.equal(folders.length, 2);
    });

    it('should return 0 folders if folder does not exist', () => {
      const folders = fileHelpers.getChildFolders(path.join(__dirname, 'thisDoesNotExist'));
      assert.equal(folders.length, 0);
    });

    it('should return correct number of folders recursively', () => {
      const folders = fileHelpers.getChildFolders(
        path.join(__dirname, 'examples'),
        { recursive: true }
      );

      assert.equal(folders.length, 5);
    });
  });

  describe('getChildFiles', () => {
    it('should return correct number of files', () => {
      const files = fileHelpers.getChildFiles(path.join(__dirname, 'examples'));
      assert.equal(files.length, 0);
    });

    it('should return 0 if folder does not exist', () => {
      const files = fileHelpers.getChildFiles(path.join(__dirname, 'thisDoesNotExist'));
      assert.equal(files.length, 0);
    });

    it('should return correct number of files recursively', () => {
      const files = fileHelpers.getChildFiles(
        path.join(__dirname, 'examples'),
        { recursive: true }
      );

      assert.equal(files.length, 9);
    });
  });

  it('getFileBasename: should pass all validations', () => {
    assert.equal(fileHelpers.getFileBasename('erwin.js'), 'erwin');
    assert.equal(fileHelpers.getFileBasename('erwin'), 'erwin');
    assert.equal(fileHelpers.getFileBasename('erwin gaitan'), 'erwin gaitan');
    assert.equal(fileHelpers.getFileBasename('erwin.gaitan.js'), 'erwin.gaitan');
    assert.equal(fileHelpers.getFileBasename('a.b.c.d.js'), 'a.b.c.d');
    assert.equal(fileHelpers.getFileBasename('omg/erwin.js'), 'erwin');
    assert.equal(fileHelpers.getFileBasename('what/the/fuck/is this.js'), 'is this');
    assert.equal(fileHelpers.getFileBasename('al right/ i gave up/st ill.css'), 'st ill');
  });

  it('getFileExtension: should pass all validations', () => {
    assert.equal(fileHelpers.getFileExtension('erwin.js'), 'js');
    assert.equal(fileHelpers.getFileExtension('erwin'), '');
    assert.equal(fileHelpers.getFileExtension('erwin gaitan'), '');
    assert.equal(fileHelpers.getFileExtension('omg/erwin.gaitan.js'), 'js');
    assert.equal(fileHelpers.getFileExtension('what/the/fuck/is this.scss'), 'scss');
    assert.equal(fileHelpers.getFileExtension('al right/ i gave up/st ill.css'), 'css');
  });
});
