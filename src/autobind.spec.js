import expect from 'must';

import autobind from './autobind';

// ===================================================================

class Foo {
  @autobind
  getFoo () {
    return this;
  }
}

// ===================================================================

describe('autobind', function () {
  it('returns a bound instance for a method', function () {
    const foo = new Foo();
    const {getFoo} = foo;

    expect(getFoo()).to.equal(foo);
  })

  it('works with multiple instances of the same class', function () {
    const foo1 = new Foo();
    const foo2 = new Foo();

    const {getFoo: getFoo1} = foo1;
    const {getFoo: getFoo2} = foo2;

    expect(getFoo1()).to.equal(foo1);
    expect(getFoo2()).to.equal(foo2);
  })
})
