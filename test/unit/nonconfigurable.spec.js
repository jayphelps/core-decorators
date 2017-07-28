import nonconfigurable from '../../lib/nonconfigurable';
import readonly from '../../lib/readonly';

describe('@nonconfigurable', function () {
  class Foo {
    @nonconfigurable
    first() {}

    @nonconfigurable
    @readonly
    second() {}
  }

  it('is marked configurable: false', function () {
    Object.getOwnPropertyDescriptor(Foo.prototype, 'first')
      .configurable.should.equal(false);

    Object.getOwnPropertyDescriptor(Foo.prototype, 'second')
      .configurable.should.equal(false);
  });

  it('causes `delete` to be noop', function () {
    const foo = new Foo();
    const { first, second } = foo;
    delete foo.first;
    delete foo.second;
    foo.first.should.equal(first);
    foo.second.should.equal(second);
  });

  // Only works as expected with @readonly
  // See https://github.com/jayphelps/core-decorators.js/issues/58
  it('throws if you try to reconfigure it', function () {
    (function () {
      Object.defineProperty(Foo.prototype, 'second', {
        value: 'I will error'
      });
    }).should.throw('Cannot redefine property: second');
  });
});
