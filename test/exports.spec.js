import * as chai from 'chai'
import * as path from 'path';
import * as glob from 'glob';
import toCamelCase from 'camelcase';
import interopRequire from 'interop-require';
import * as decorators from '../';

const should = chai.should();

const aliases = {
  deprecate: 'deprecated',
  mixin: 'mixins'
};

describe('Main package exports', function () {
  const libPath = path.normalize(`${__dirname}/../lib`);
  let filePaths;

  beforeEach(function () {
    filePaths = glob.sync(`${libPath}/*.js`, {
      ignore: ['**/core-decorators.js', '**/*.spec.js']
    });
  });

  afterEach(function () {
    filePaths = null;
  });

  it('exports all defined decorator files inside core-decorators.js', function () {
    const aliasKeys = Object.keys(aliases);
    const unseen = Object.keys(decorators);

    function markAsSeen(name) {
      unseen.splice(unseen.indexOf(name), 1);
    }

    filePaths.forEach(filePath => {
      const name = toCamelCase(
        path.basename(filePath, '.js')
      );
      const decorator = interopRequire(filePath);
      should.exist(decorators[name], `@${name} should be exported`);
      decorators[name].should.equal(decorator, `export @${name} is the expected function`);

      markAsSeen(name);
      if (aliasKeys.indexOf(name) !== -1) {
        markAsSeen(aliases[name]);
      }
    });

    unseen.should.deep.equal([], 'all exports were seen');
  });
});
