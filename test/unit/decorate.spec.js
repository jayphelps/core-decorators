import chai from 'chai';
import decorate from '../../lib/decorate';

describe('decorate', function () {
  let Foo;

  beforeEach(function () {
    const decorator = function (fn, suffix) {
      return function (msg) {
        return fn(msg) + suffix;
      };
    };

    Foo = class Foo {
      @decorate(decorator, '!!')
      suchWow(something) {
        return something + 'bro';
      }
    }
  });

  it('correctly applies user provided function to method', function () {
    const foo = new Foo();

    foo.suchWow('dude').should.equal('dudebro!!');
  });

  it('sets the correct prototype descriptor options', function () {
    const desc = Object.getOwnPropertyDescriptor(Foo.prototype, 'suchWow');

    desc.configurable.should.equal(true);
    desc.enumerable.should.equal(false);
  });
});
