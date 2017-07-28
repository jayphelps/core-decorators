import nonenumerable from '../../lib/nonenumerable';

describe('@nonenumerable', function () {
  class Foo {
    @nonenumerable
    bar = 'test';
  }

  it('is not enumerable', function () {
    const foo = new Foo();
    Object.getOwnPropertyDescriptor(foo, 'bar').enumerable.should.equal(false);
  });
});
