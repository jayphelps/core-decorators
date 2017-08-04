const chai = require('chai');
const path = require('path');
const glob = require('glob');
const camelCase = require('camelCase');
const interopRequire = require('interop-require');
const decorators = require('core-decorators');

const should = chai.should();

const aliases = {
  deprecate: 'deprecated'
};

describe('Main package exports', function() {
  const libPath = path.normalize(`${__dirname}/../lib`);
  let filePaths;

  beforeEach(function() {
    filePaths = glob.sync(`${libPath}/*.js`, {
      ignore: ['**/core-decorators.js', '**/*.spec.js']
    });
  });

  afterEach(function() {
    filePaths = null;
  });

  it('exports all defined decorator files inside core-decorators.js', function() {
    const aliasKeys = Object.keys(aliases);
    const unseen = Object.keys(decorators);

    function markAsSeen(name) {
      unseen.splice(unseen.indexOf(name), 1);
    }

    filePaths.forEach(filePath => {
      const name = camelCase(
        path.basename(filePath, '.js')
      );
      const decorator = interopRequire(filePath);
      should.exist(decorator, `interopRequire should return somethig for ${name}`);
      should.exist(decorators[name], `@${name} should be exported`);
      decorators[name].toString().should.equal(decorator.toString(), `export @${name} is the expected function`);

      markAsSeen(name);
      if (aliasKeys.indexOf(name) !== -1) {
        markAsSeen(aliases[name]);
      }
    });

    unseen.should.deep.equal([], 'all exports were seen');
  });
});
