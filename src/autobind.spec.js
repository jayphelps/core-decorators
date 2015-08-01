import chai from 'chai';
import autobind from './autobind';

chai.should();

class Foo {
  @autobind
  getFoo () {
    return this;
  }
}

describe('autobind', function () {
  it('returns a bound instance for a method', function () {
    const foo = new Foo();
    const { getFoo } = foo;

    getFoo().should.equal(foo);
  });

  it('works with multiple instances of the same class', function () {
    const foo1 = new Foo();
    const foo2 = new Foo();

    const getFoo1 = foo1.getFoo;
    const getFoo2 = foo2.getFoo;

    getFoo1().should.equal(foo1);
    getFoo2().should.equal(foo2);
  });
});
