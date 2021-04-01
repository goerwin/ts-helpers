import * as path from 'path';
import * as fileHelpers from '../file';
import * as types from '../types';

function parsePathToFile(
  filepath: string,
  options: types.ParsePathToOptions = {}
): types.File {
  const { name, base, ext } = path.parse(filepath);
  return {
    name,
    base,
    ext,
    path: path.relative('.', filepath),
    isIgnored: options.isIgnored || false,
  };
}

function parsePathToJsonTreeFile(
  filepath: string,
  options: types.ParsePathToOptions = {}
): types.JsonTreeFile {
  return {
    type: 'file',
    ...parsePathToFile(filepath, options),
  };
}

function parsePathToDirectory(
  dirpath: string,
  options: types.ParsePathToOptions = {}
): types.Directory {
  const { base } = path.parse(dirpath);
  return {
    name: base,
    path: path.relative('.', dirpath),
    isIgnored: options.isIgnored || false,
    isEmpty: options.isEmpty || false,
  };
}

function parseDirPathToJsonTreeDir(
  dirpath: string,
  options: types.ParsePathToOptions = {}
): types.JsonTreeDir {
  const { base } = path.parse(dirpath);

  return {
    type: 'directory',
    ...parsePathToDirectory(dirpath, options),
    children: [],
  };
}

describe('file helpers', () => {
  describe('getChildDirs', () => {
    it('should return correct number of dirs', () => {
      const dirs = fileHelpers.getChildDirs(path.join(__dirname, 'examples'));
      expect(dirs.length).toEqual(2);
    });

    it('should return 0 dirs if dir does not exist', () => {
      const dirs = fileHelpers.getChildDirs(
        path.join(__dirname, 'thisDoesNotExist')
      );
      expect(dirs.length).toEqual(0);
    });

    it('should return correct number of dirs recursively', () => {
      const dirs = fileHelpers.getChildDirs(path.join(__dirname, 'examples'), {
        recursive: true,
      });

      expect(dirs.length).toEqual(5);
    });

    it('should return correct dirs info', () => {
      const expected = [
        {
          name: 'aaaa bbb cc',
          path: 'aaaa bbb cc',
          isIgnored: false,
          isEmpty: false,
        },
        {
          name: 'erwin',
          path: 'erwin',
          isIgnored: false,
          isEmpty: false,
        },
      ];

      expect(
        fileHelpers.getChildDirs(path.join(__dirname, 'examples'))
      ).toEqual(expected);
    });

    it('should return correct dirs info recursively', () => {
      const expected = [
        {
          name: 'aaaa bbb cc',
          path: 'aaaa bbb cc',
          isIgnored: false,
          isEmpty: false,
        },
        {
          name: 'erwin',
          path: 'erwin',
          isIgnored: false,
          isEmpty: false,
        },
        {
          name: 'gaitan',
          path: 'erwin/gaitan',
          isIgnored: false,
          isEmpty: false,
        },
        {
          name: 'gogo',
          path: 'erwin/gogo',
          isIgnored: false,
          isEmpty: false,
        },
        {
          name: 'ospino',
          path: 'erwin/gaitan/ospino',
          isIgnored: false,
          isEmpty: false,
        },
      ];

      expect(
        fileHelpers.getChildDirs(path.join(__dirname, 'examples'), {
          recursive: true,
        })
      ).toEqual(expected);
    });

    it('should return correct dirs info when ignoring some of them', () => {
      const expected = [
        {
          name: 'aaaa bbb cc',
          path: 'aaaa bbb cc',
          isIgnored: false,
          isEmpty: false,
        },
        {
          name: 'erwin',
          path: 'erwin',
          isIgnored: false,
          isEmpty: false,
        },
        {
          name: 'gaitan',
          path: 'erwin/gaitan',
          isIgnored: true,
          isEmpty: false,
        },
        {
          name: 'gogo',
          path: 'erwin/gogo',
          isIgnored: true,
          isEmpty: false,
        },
      ];

      expect(
        fileHelpers.getChildDirs(path.join(__dirname, 'examples'), {
          recursive: true,
          ignoreDirs: ['./erwin/gaitan', 'erwin/gogo'],
        })
      ).toEqual(expected);
    });
  });

  describe('getChildFiles', () => {
    it('should return correct number of files', () => {
      const files = fileHelpers.getChildFiles(path.join(__dirname, 'examples'));
      expect(files.length).toEqual(0);
    });

    it('should return 0 if dir does not exist', () => {
      const files = fileHelpers.getChildFiles(
        path.join(__dirname, 'thisDoesNotExist')
      );
      expect(files.length).toEqual(0);
    });

    it('should return correct number of files recursively', () => {
      const files = fileHelpers.getChildFiles(
        path.join(__dirname, 'examples'),
        { recursive: true }
      );

      expect(files.length).toEqual(9);
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
          path: '$amazing stuff.jpg',
        },
        {
          base: '1.js',
          ext: '.js',
          isIgnored: false,
          name: '1',
          path: '1.js',
        },
        {
          base: '2.css',
          ext: '.css',
          isIgnored: true,
          name: '2',
          path: '2.css',
        },
        {
          base: '3 4 lul wut',
          ext: '',
          isIgnored: false,
          name: '3 4 lul wut',
          path: '3 4 lul wut',
        },
        {
          base: '.lul',
          ext: '',
          isIgnored: false,
          name: '.lul',
          path: 'gogo/.lul',
        },
        {
          base: '2',
          ext: '',
          isIgnored: false,
          name: '2',
          path: 'gogo/2',
        },
        {
          base: 'math.js',
          ext: '.js',
          isIgnored: true,
          name: 'math',
          path: 'gogo/math.js',
        },
        {
          base: '1.js',
          ext: '.js',
          isIgnored: false,
          name: '1',
          path: 'gaitan/ospino/1.js',
        },
      ];

      expect(actual).toEqual(expected);
    });

    it('should return correct files info (excluding dir and files)', () => {
      const actual = fileHelpers.getChildFiles(
        path.join(__dirname, 'examples/erwin'),
        {
          recursive: true,
          ignoreDirs: ['gaitan'],
          ignoreFiles: ['2.css', 'gogo/math.js'],
        }
      );

      const expected = [
        {
          base: '$amazing stuff.jpg',
          ext: '.jpg',
          isIgnored: false,
          name: '$amazing stuff',
          path: '$amazing stuff.jpg',
        },
        {
          base: '1.js',
          ext: '.js',
          isIgnored: false,
          name: '1',
          path: '1.js',
        },
        {
          base: '2.css',
          ext: '.css',
          isIgnored: true,
          name: '2',
          path: '2.css',
        },
        {
          base: '3 4 lul wut',
          ext: '',
          isIgnored: false,
          name: '3 4 lul wut',
          path: '3 4 lul wut',
        },
        {
          base: '.lul',
          ext: '',
          isIgnored: false,
          name: '.lul',
          path: 'gogo/.lul',
        },
        {
          base: '2',
          ext: '',
          isIgnored: false,
          name: '2',
          path: 'gogo/2',
        },
        {
          base: 'math.js',
          ext: '.js',
          isIgnored: true,
          name: 'math',
          path: 'gogo/math.js',
        },
      ];

      expect(actual).toEqual(expected);

      // containing trailing / in ignoreDirs
      const actual2 = fileHelpers.getChildFiles(
        path.join(__dirname, 'examples/erwin'),
        {
          recursive: true,
          ignoreDirs: ['gaitan/'],
          ignoreFiles: ['2.css', 'gogo/math.js'],
        }
      );

      expect(actual2).toEqual(expected);
    });
  });

  describe('generateJsonTree()', () => {
    it('should generate correct output for no files', () => {
      const actual = fileHelpers.generateJsonTree('lul', []);
      const expected = undefined;
      expect(actual).toEqual(expected);
    });

    it('should generate correct output for 0 level deep', () => {
      const actual = fileHelpers.generateJsonTree('lul', [
        parsePathToFile('./lul/package.json'),
        parsePathToFile('./lul/anotherthing.js'),
      ]);

      const expected = {
        ...parseDirPathToJsonTreeDir('lul'),
        children: [
          parsePathToJsonTreeFile('./lul/anotherthing.js'),
          parsePathToJsonTreeFile('./lul/package.json'),
        ],
      };

      expect(actual).toEqual(expected);
    });

    it('should generate correct output for 1 level deep', () => {
      const actual = fileHelpers.generateJsonTree('lul', [
        parsePathToFile('lul/package.json'),
        parsePathToFile('lul/anotherthing.js'),
        parsePathToFile('lul/omg/index.js'),
      ]);

      const expected = {
        ...parseDirPathToJsonTreeDir('lul'),
        children: [
          parsePathToJsonTreeFile('lul/anotherthing.js'),
          {
            ...parseDirPathToJsonTreeDir('lul/omg'),
            children: [parsePathToJsonTreeFile('lul/omg/index.js')],
          },
          parsePathToJsonTreeFile('lul/package.json'),
        ],
      };

      expect(actual).toEqual(expected);
    });

    it('should generate correct output for 2 level deep', () => {
      const actual = fileHelpers.generateJsonTree('lul', [
        parsePathToFile('lul/package.json'),
        parsePathToFile('lul/src/hehe/wut.js'),
        parsePathToFile('lul/omg/what/thefuck.jpg'),
        parsePathToFile('lul/omg/what/thefuck2.jpg'),
        parsePathToFile('lul/omg/index.js'),
      ]);

      const expected = {
        ...parseDirPathToJsonTreeDir('lul'),
        children: [
          {
            ...parseDirPathToJsonTreeDir('lul/omg'),
            children: [
              parsePathToJsonTreeFile('lul/omg/index.js'),
              {
                ...parseDirPathToJsonTreeDir('lul/omg/what'),
                children: [
                  parsePathToJsonTreeFile('lul/omg/what/thefuck.jpg'),
                  parsePathToJsonTreeFile('lul/omg/what/thefuck2.jpg'),
                ],
              },
            ],
          },
          parsePathToJsonTreeFile('lul/package.json'),
          {
            ...parseDirPathToJsonTreeDir('lul/src'),
            children: [
              {
                ...parseDirPathToJsonTreeDir('lul/src/hehe'),
                children: [parsePathToJsonTreeFile('lul/src/hehe/wut.js')],
              },
            ],
          },
        ],
      };

      expect(actual).toEqual(expected);
    });

    it('should generate correct output for empty dirs', () => {
      const actual = fileHelpers.generateJsonTree('lul', [
        parsePathToFile('./lul/package.json'),
        parsePathToDirectory('lul/emptydir', { isEmpty: true }),
      ]);

      const expected = {
        ...parseDirPathToJsonTreeDir('lul'),
        children: [
          {
            ...parseDirPathToJsonTreeDir('lul/emptydir', { isEmpty: true }),
            children: [],
          },
          parsePathToJsonTreeFile('./lul/package.json'),
        ],
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('generateAsciiTree()', () => {
    it('should return correct output for no files', () => {
      const actual = fileHelpers.generateAsciiTree('lul', []);
      const expected = null;
      expect(actual).toEqual(expected);
    });

    it('should generate correct output for 0 levels', () => {
      const actual = fileHelpers.generateAsciiTree('lul', [
        parsePathToFile('./lul/package.json'),
        parsePathToFile('./lul/anotherthing.js'),
      ]);

      const expected = 'lul\n' + '├── anotherthing.js\n' + '└── package.json';

      expect(actual).toEqual(expected);
    });

    it('should generate correct output for 1 level deep', () => {
      const actual = fileHelpers.generateAsciiTree('lul', [
        parsePathToFile('lul/package.json'),
        parsePathToFile('lul/anotherthing.js'),
        parsePathToFile('lul/omg/index.js'),
      ]);

      const expected =
        'lul\n' +
        '├── anotherthing.js\n' +
        '├── omg\n' +
        '│   └── index.js\n' +
        '└── package.json';

      expect(actual).toEqual(expected);
    });

    it('should generate correct output for 2 level deep', () => {
      const actual = fileHelpers.generateAsciiTree('lul', [
        parsePathToFile('lul/package.json'),
        parsePathToFile('lul/src/hehe/wut.js'),
        parsePathToFile('lul/omg/what/thefuck.jpg'),
        parsePathToFile('lul/omg/what/thefuck2.jpg'),
        parsePathToFile('lul/omg/index.js'),
      ]);

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

      expect(actual).toEqual(expected);
    });

    it('should generate correct output for 3 level deep', () => {
      const actual = fileHelpers.generateAsciiTree('lul', [
        parsePathToFile('lul/package.json'),
        parsePathToFile('lul/src/hehe/wut.js'),
        parsePathToFile('lul/win/ammm/cas.jpg'),
        parsePathToFile('lul/win/ammm/level3/1.js'),
        parsePathToFile('lul/win/ammm/level3/2.js'),
        parsePathToFile('lul/win/ammm/thefuck3.js'),
        parsePathToFile('lul/win/index.js'),
        parsePathToFile('lul/zzz/index.js'),
      ]);

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

      expect(actual).toEqual(expected);
    });

    it('should print empty dir', () => {
      const actual = fileHelpers.generateAsciiTree('lul', [
        parsePathToFile('./lul/anotherthing.js'),
        parsePathToDirectory('lul/erwin/gaitan', { isEmpty: true }),
      ]);

      const expected =
        'lul\n' +
        '├── anotherthing.js\n' +
        '└── erwin\n' +
        '    └── gaitan /emptyDirectory';

      expect(actual).toEqual(expected);
    });

    it('should print ignored file', () => {
      const actual = fileHelpers.generateAsciiTree('lul', [
        parsePathToFile('./lul/package.json', { isIgnored: true }),
        parsePathToFile('./lul/anotherthing.js'),
      ]);

      const expected =
        'lul\n' + '├── anotherthing.js\n' + '└── package.json /fileIgnored';

      expect(actual).toEqual(expected);
    });

    it('should print ignored directory', () => {
      const actual = fileHelpers.generateAsciiTree('lul', [
        parsePathToFile('./lul/anotherthing.js'),
        parsePathToDirectory('lul/erwin/gaitan', { isIgnored: true }),
      ]);

      const expected =
        'lul\n' +
        '├── anotherthing.js\n' +
        '└── erwin\n' +
        '    └── gaitan /directoryIgnored';

      expect(actual).toEqual(expected);
    });

    it('should print ignored/empty directory', () => {
      const actual = fileHelpers.generateAsciiTree('lul', [
        parsePathToFile('./lul/anotherthing.js'),
        parsePathToDirectory('lul/erwin/gaitan', {
          isEmpty: true,
          isIgnored: true,
        }),
      ]);

      const expected =
        'lul\n' +
        '├── anotherthing.js\n' +
        '└── erwin\n' +
        '    └── gaitan /emptyDirectory /directoryIgnored';

      expect(actual).toEqual(expected);
    });
  });
});
