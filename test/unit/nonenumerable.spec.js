import chai from 'chai';
import nonenumerable from '../../lib/nonenumerable';

describe('@nonenumerable', function () {
  class Foo {
    @nonenumerable
    bar = 'test';
  }

  it('is not enumerable', function () {
    Object.getOwnPropertyDescriptor(Foo.prototype, 'bar')
      .enumerable.should.equal(false);
  });
});
