import chai from 'chai';
import nonenumerable from '../../lib/nonenumerable';

function enumerable (target, key, descriptor){
  descriptor.enumerable = true;
  return descriptor;
}

describe('nonenumerable', function () {
  class Foo {
    @nonenumerable
    @enumerable
    bar(){}
  }

  it('is nonenumerable', function () {
    Object.getOwnPropertyDescriptor(Foo.prototype, 'bar')
      .enumerable.should.equal(false);
  });
});
