import * as assert from 'assert';
import * as path from 'path';
import * as fileHelpers from '../file';

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

      // containing trailing / in ignoreDirs
      const actual2 = fileHelpers.getChildFiles(
        path.join(__dirname, 'examples/erwin'),
        { recursive: true, ignoreDirs: ['gaitan/'], ignoreFiles: ['2.css', 'gogo/math.js'] }
      );

      assert.deepStrictEqual(actual2, expected);
    });
  });

  describe('generateJsonTree()', () => {
    it('should generate correct output for no files', () => {
      const actual = fileHelpers.generateJsonTree('lul', []);
      const expected = undefined;
      assert.equal(actual, expected);
    });

    it('should generate correct output for 0 level deep', () => {
      const actual = fileHelpers.generateJsonTree(
        'lul',
        ['./lul/package.json', './lul/anotherthing.js']
      );

      const expected = {
        name: 'lul',
        path: 'lul',
        children: [
          { name: 'anotherthing.js', path: 'lul/anotherthing.js' },
          { name: 'package.json', path: 'lul/package.json' }
        ]
      };

      assert.deepStrictEqual(actual, expected);
    });

    it('should generate correct output for 1 level deep', () => {
      const actual = fileHelpers.generateJsonTree(
        'lul',
        ['lul/package.json', 'lul/anotherthing.js', 'lul/omg/index.js']
      );

      const expected = {
        name: 'lul',
        path: 'lul',
        children: [
          { name: 'anotherthing.js', path: 'lul/anotherthing.js' },
          {
            name: 'omg',
            path: 'lul/omg',
            children: [
              { name: 'index.js', path: 'lul/omg/index.js' }
            ]
          },
          { name: 'package.json', path: 'lul/package.json' }
        ]
      };

      assert.deepStrictEqual(actual, expected);
    });

    it('should generate correct output for 2 level deep', () => {
      const actual = fileHelpers.generateJsonTree(
        'lul',
        [
          'lul/package.json',
          'lul/src/hehe/wut.js',
          'lul/omg/what/thefuck.jpg',
          'lul/omg/what/thefuck2.jpg',
          'lul/omg/index.js'
        ]
      );

      const expected = {
        name: 'lul',
        path: 'lul',
        children: [
          {
            name: 'omg',
            path: 'lul/omg',
            children: [
              { name: 'index.js', path: 'lul/omg/index.js' },
              {
                name: 'what',
                path: 'lul/omg/what',
                children: [
                  { name: 'thefuck.jpg', path: 'lul/omg/what/thefuck.jpg' },
                  { name: 'thefuck2.jpg', path: 'lul/omg/what/thefuck2.jpg' }
                ]
              }
            ]
          },
          { name: 'package.json', path: 'lul/package.json' },
          {
            name: 'src',
            path: 'lul/src',
            children: [
              {
                name: 'hehe',
                path: 'lul/src/hehe',
                children: [
                  { name: 'wut.js', path: 'lul/src/hehe/wut.js' }
                ]
              }
            ]
          }
        ]
      };

      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('generateAsciiTree()', () => {
    it('should return correct output for no files', () => {
      const actual = fileHelpers.generateAsciiTree('lul', []);
      const expected = null;
      assert.equal(actual, expected);
    });

    it('should generate correct output for 0 levels', () => {
      const actual = fileHelpers.generateAsciiTree(
        'lul',
        ['./lul/package.json', './lul/anotherthing.js']
      );

      const expected =
        'lul\n' +
        '├── anotherthing.js\n' +
        '└── package.json';

      assert.equal(actual, expected);
    });

    it('should generate correct output for 1 level deep', () => {
      const actual = fileHelpers.generateAsciiTree(
        'lul',
        ['lul/package.json', 'lul/anotherthing.js', 'lul/omg/index.js']
      );

      const expected =
        'lul\n' +
        '├── anotherthing.js\n' +
        '├── omg\n' +
        '│   └── index.js\n' +
        '└── package.json';

      assert.deepStrictEqual(actual, expected);
    });

    it('should generate correct output for 2 level deep', () => {
      const actual = fileHelpers.generateAsciiTree(
        'lul',
        [
          'lul/package.json',
          'lul/src/hehe/wut.js',
          'lul/omg/what/thefuck.jpg',
          'lul/omg/what/thefuck2.jpg',
          'lul/omg/index.js'
        ]
      );

      const expected =
        'lul\n' +
        '├── omg\n' +
        '│   ├── index.js\n' +
        '│   └── what\n' +
        '│       ├── thefuck.jpg\n' +
        '│       └── thefuck2.jpg\n' +
        '├── package.json\n' +
        '└── src\n' +
        '    └── hehe\n' +
        '        └── wut.js';

      assert.deepStrictEqual(actual, expected);
    });

    it('should generate correct output for 3 level deep', () => {
      const actual = fileHelpers.generateAsciiTree(
        'lul',
        [
          'lul/package.json',
          'lul/src/hehe/wut.js',
          'lul/win/ammm/cas.jpg',
          'lul/win/ammm/level3/1.js',
          'lul/win/ammm/level3/2.js',
          'lul/win/ammm/thefuck3.js',
          'lul/win/index.js',
          'lul/zzz/index.js'
        ]
      );

      const expected =
        'lul\n' +
        '├── package.json\n' +
        '├── src\n' +
        '│   └── hehe\n' +
        '│       └── wut.js\n' +
        '├── win\n' +
        '│   ├── ammm\n' +
        '│   │   ├── cas.jpg\n' +
        '│   │   ├── level3\n' +
        '│   │   │   ├── 1.js\n' +
        '│   │   │   └── 2.js\n' +
        '│   │   └── thefuck3.js\n' +
        '│   └── index.js\n' +
        '└── zzz\n' +
        '    └── index.js';

      assert.deepStrictEqual(actual, expected);
    });
  });
});
