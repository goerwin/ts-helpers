const path = require('path');
const assert = require('assert');
const fileHelpers = require('../file');
require('../url');

describe('file helpers', () => {
  describe('getChildDirs', () => {
    it('should return correct number of dirs', () => {
      const dirs = fileHelpers.getChildDirs(path.join(__dirname, 'examples'));
      assert.equal(dirs.length, 2);
    });

    it('should return 0 dirs if dir does not exist', () => {
      const dirs = fileHelpers.getChildDirs(path.join(__dirname, 'thisDoesNotExist'));
      assert.equal(dirs.length, 0);
    });

    it('should return correct number of dirs recursively', () => {
      const dirs = fileHelpers.getChildDirs(
        path.join(__dirname, 'examples'),
        { recursive: true }
      );

      assert.equal(dirs.length, 5);
    });

    it('should return correct dirs info', () => {
      const expected = [
        {
          name: 'aaaa bbb cc',
          path: 'aaaa bbb cc',
          isIgnored: false,
          isEmpty: false
        },
        {
          name: 'erwin',
          path: 'erwin',
          isIgnored: false,
          isEmpty: false
        }
      ];

      assert.deepStrictEqual(
        fileHelpers.getChildDirs(path.join(__dirname, 'examples')),
        expected
      );
    });

    it('should return correct dirs info recursively', () => {
      const expected = [
        {
          name: 'aaaa bbb cc',
          path: 'aaaa bbb cc',
          isIgnored: false,
          isEmpty: false
        },
        {
          name: 'erwin',
          path: 'erwin',
          isIgnored: false,
          isEmpty: false
        },
        {
          name: 'gaitan',
          path: 'erwin/gaitan',
          isIgnored: false,
          isEmpty: false
        },
        {
          name: 'gogo',
          path: 'erwin/gogo',
          isIgnored: false,
          isEmpty: false
        },
        {
          name: 'ospino',
          path: 'erwin/gaitan/ospino',
          isIgnored: false,
          isEmpty: false
        }
      ];

      assert.deepStrictEqual(
        fileHelpers.getChildDirs(path.join(__dirname, 'examples'), { recursive: true }),
        expected
      );
    });

    it('should return correct dirs info when ignoring some of them', () => {
      const expected = [
        {
          name: 'aaaa bbb cc',
          path: 'aaaa bbb cc',
          isIgnored: false,
          isEmpty: false
        },
        {
          name: 'erwin',
          path: 'erwin',
          isIgnored: false,
          isEmpty: false
        },
        {
          name: 'gaitan',
          path: 'erwin/gaitan',
          isIgnored: true,
          isEmpty: false
        },
        {
          name: 'gogo',
          path: 'erwin/gogo',
          isIgnored: true,
          isEmpty: false
        }
      ];

      assert.deepStrictEqual(
        fileHelpers.getChildDirs(
          path.join(__dirname, 'examples'),
          {
            recursive: true,
            ignoreDirs: ['./erwin/gaitan', 'erwin/gogo']
          }
        ),
        expected
      );
    });
  });

  describe('getChildFiles', () => {
    it('should return correct number of files', () => {
      const files = fileHelpers.getChildFiles(path.join(__dirname, 'examples'));
      assert.equal(files.length, 0);
    });

    it('should return 0 if dir does not exist', () => {
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

    it('should return correct files info', () => {
      const actual = fileHelpers.getChildFiles(
        path.join(__dirname, 'examples/erwin'),
        { recursive: true, ignoreFiles: ['2.css', 'gogo/math.js'] }
      );

      const expected = [
        {
          base: '$amazing stuff.jpg',
          ext: '.jpg',
          isIgnored: false,
          name: '$amazing stuff',
          path: '$amazing stuff.jpg'
        },
        {
          base: '1.js',
          ext: '.js',
          isIgnored: false,
          name: '1',
          path: '1.js'
        },
        {
          base: '2.css',
          ext: '.css',
          isIgnored: true,
          name: '2',
          path: '2.css'
        },
        {
          base: '3 4 lul wut',
          ext: '',
          isIgnored: false,
          name: '3 4 lul wut',
          path: '3 4 lul wut'
        },
        {
          base: '.lul',
          ext: '',
          isIgnored: false,
          name: '.lul',
          path: 'gogo/.lul'
        },
        {
          base: '2',
          ext: '',
          isIgnored: false,
          name: '2',
          path: 'gogo/2'
        },
        {
          base: 'math.js',
          ext: '.js',
          isIgnored: true,
          name: 'math',
          path: 'gogo/math.js'
        },
        {
          base: '1.js',
          ext: '.js',
          isIgnored: false,
          name: '1',
          path: 'gaitan/ospino/1.js'
        }
      ];

      assert.deepStrictEqual(actual, expected);
    });

    it('should return correct files info (excluding dir and files)', () => {
      const actual = fileHelpers.getChildFiles(
        path.join(__dirname, 'examples/erwin'),
        { recursive: true, ignoreDirs: ['gaitan'], ignoreFiles: ['2.css', 'gogo/math.js'] }
      );

      const expected = [
        {
          base: '$amazing stuff.jpg',
          ext: '.jpg',
          isIgnored: false,
          name: '$amazing stuff',
          path: '$amazing stuff.jpg'
        },
        {
          base: '1.js',
          ext: '.js',
          isIgnored: false,
          name: '1',
          path: '1.js'
        },
        {
          base: '2.css',
          ext: '.css',
          isIgnored: true,
          name: '2',
          path: '2.css'
        },
        {
          base: '3 4 lul wut',
          ext: '',
          isIgnored: false,
          name: '3 4 lul wut',
          path: '3 4 lul wut'
        },
        {
          base: '.lul',
          ext: '',
          isIgnored: false,
          name: '.lul',
          path: 'gogo/.lul'
        },
        {
          base: '2',
          ext: '',
          isIgnored: false,
          name: '2',
          path: 'gogo/2'
        },
        {
          base: 'math.js',
          ext: '.js',
          isIgnored: true,
          name: 'math',
          path: 'gogo/math.js'
        }
      ];

      assert.deepStrictEqual(actual, expected);
    });
  });
});
