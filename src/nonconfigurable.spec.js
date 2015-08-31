import chai from 'chai';
import nonconfigurable from './nonconfigurable';


describe('nonconfigurable', function () {
  class Foo {
    @nonconfigurable
    bar(){}
  }

  it('is nonconfigurable', function () {
    Object.getOwnPropertyDescriptor(Foo.prototype, 'bar')
      .configurable.should.equal(false);
  });
});
