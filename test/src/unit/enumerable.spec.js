import { enumerable } from 'core-decorators';

describe('@enumerable', function () {
  class Foo {
    @enumerable
    bar(){}
  }

  it('is enumerable', function () {
    Object.getOwnPropertyDescriptor(Foo.prototype, 'bar')
      .enumerable.should.equal(true);
  });
});
