const assert = require('assert');
const fileHelpers = require('../file');

describe('file helpers', () => {
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
