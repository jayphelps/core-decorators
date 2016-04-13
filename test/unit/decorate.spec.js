import decorate from '../../lib/decorate';
import { memoize } from 'lodash';

describe('@decorate', function () {
  let Foo;

  beforeEach(function () {
    const append = function (fn, suffix) {
      return function (msg) {
        return fn(msg) + suffix;
      };
    };

    Foo = class Foo {
      @decorate(append, '!!')
      suchWow(something) {
        return something + 'bro';
      }

      @decorate(memoize)
      getFoo() {
        return this;
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

  it('is tied to the instance, not the prototype', function () {
    const foo1 = new Foo();
    const foo2 = new Foo();

    const foo1Result = foo1.getFoo();
    const foo2Result = foo2.getFoo();

    foo1Result.should.not.equal(foo2Result);
    foo1Result.should.equal(foo1);
    foo2Result.should.equal(foo2);
  });
});
