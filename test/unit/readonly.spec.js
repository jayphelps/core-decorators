import chai from 'chai';
import readonly from '../../lib/readonly';

describe('@readonly', function () {
  class Foo {
    @readonly
    bar(){}
  }

  it('is readonly', function () {
    Object.getOwnPropertyDescriptor(Foo.prototype, 'bar')
      .writable.should.equal(false);
  });
});
