import chai from 'chai';
import autobind from '../../lib/autobind';

const root = (typeof window !== 'undefined') ? window : global;

describe('@autobind', function () {
  let Foo;
  let Bar;
  let barCount;

  beforeEach(function () {
    Foo = class Foo {
      @autobind
      getFoo() {
        return this;
      }

      getFooAgain() {
        return this;
      }
    }

    barCount = 0;

    Bar = class Bar extends Foo {
      @autobind
      getFoo() {
        const foo = super.getFoo();
        barCount++;
        return foo;
      }

      getSuperMethod() {
        return super.getFoo;
      }
    }
  });

  afterEach(function () {
    Foo = null;
    Bar = null;
    barCount = null;
  });

  it('returns a bound instance for a method', function () {
    const foo = new Foo();
    const { getFoo } = foo;

    getFoo().should.equal(foo);
  });

  it('sets the correct prototype descriptor options', function () {
    const desc = Object.getOwnPropertyDescriptor(Foo.prototype, 'getFoo');

    desc.configurable.should.equal(true);
    desc.enumerable.should.equal(false);
  });

  it('sets the correct instance descriptor options when bound', function () {
    const foo = new Foo();
    const { getFoo } = foo;
    const desc = Object.getOwnPropertyDescriptor(foo, 'getFoo');

    desc.configurable.should.equal(true);
    desc.enumerable.should.equal(false);
    desc.writable.should.equal(true);
    desc.value.should.equal(getFoo);
  });

  it('sets the correct instance descriptor options when reassigned outside', function () {
    const noop = function () {};
    const foo = new Foo();
    const ret = foo.getFoo = noop;
    const desc = Object.getOwnPropertyDescriptor(foo, 'getFoo');

    ret.should.equal(noop);
    desc.configurable.should.equal(true);
    desc.enumerable.should.equal(true);
    desc.writable.should.equal(true);
    desc.value.should.equal(noop);
  });

  it('works with multiple instances of the same class', function () {
    const foo1 = new Foo();
    const foo2 = new Foo();

    const getFoo1 = foo1.getFoo;
    const getFoo2 = foo2.getFoo;

    getFoo1().should.equal(foo1);
    getFoo2().should.equal(foo2);
  });

  it('returns the same bound function every time', function () {
    const foo = new Foo();
    const bar = new Bar();

    foo.getFoo.should.equal(foo.getFoo);
    bar.getFoo.should.equal(bar.getFoo);
    bar.getSuperMethod().should.equal(bar.getSuperMethod());
    bar.getFooAgain().should.equal(bar.getFooAgain());
  });

  it('works with inheritance, super.method() being autobound as well', function () {
    const bar = new Bar();
    const getFoo = bar.getFoo;

    // Calling both forms more than once to catch
    // bugs that only appear after first invocation
    getFoo().should.equal(bar);
    getFoo().should.equal(bar);
    bar.getFoo().should.equal(bar);
    bar.getFoo().should.equal(bar);
    bar.getFooAgain().should.equal(bar);

    barCount.should.equal(4);
  });

  it('throws when it needs WeakMap but it is not available', function () {
    const WeakMap = root.WeakMap;
    delete root.WeakMap;

    const bar = new Bar();

    (function () {
      bar.getFoo();
    }).should.throw(`Using @autobind on getFoo() requires WeakMap support due to its use of super.getFoo()
      See https://github.com/jayphelps/core-decorators.js/issues/20`);

    barCount.should.equal(0);

    root.WeakMap = WeakMap;
  });

  it('does not override descriptor when accessed on the prototype', function () {
    Foo.prototype.getFoo;

    const foo = new Foo();
    const getFoo1 = foo.getFoo;
    getFoo1().should.equal(foo);

    Bar.prototype.getFoo;

    const bar = new Bar();
    const getFoo2 = bar.getFoo;
    getFoo2().should.equal(bar);

    barCount.should.equal(1);
  });
});
