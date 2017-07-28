import { expect } from 'chai';
import autobind from '../../lib/autobind';

const root = (typeof window !== 'undefined') ? window : global;

describe('@autobind', function () {
  let Foo;
  let Bar;
  let Car;
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

      @autobind
      onlyOnFoo() {
        return this;
      }
    }

    barCount = 0;

    Bar = class Bar extends Foo {
      @autobind()
      getFoo() {
        const foo = super.getFoo();
        barCount++;
        return foo;
      }

      getSuperMethod_getFoo() {
        return super.getFoo;
      }

      getSuperMethod_onlyOnFoo() {
        return super.onlyOnFoo;
      }

      @autobind
      onlyOnBar() {
        return this;
      }
    }

    Car = class Car extends Foo {
      @autobind()
      getCarFromFoo() {
        return super.onlyOnFoo();
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
    bar.getSuperMethod_getFoo().should.equal(bar.getSuperMethod_getFoo());
    bar.getFooAgain().should.equal(bar.getFooAgain());
  });

  it('works with inheritance, super.method() being autobound as well', function () {
    const bar = new Bar();
    const car = new Car();

    const getFooFromBar = bar.getFoo;
    const getCarFromFoo = car.getCarFromFoo;

    // Calling both forms more than once to catch
    // bugs that only appear after first invocation
    getFooFromBar().should.equal(bar);
    getFooFromBar().should.equal(bar);
    getCarFromFoo().should.equal(car);
    getCarFromFoo().should.equal(car);

    bar.getFoo().should.equal(bar);
    bar.getFoo().should.equal(bar);
    bar.getFooAgain().should.equal(bar);
    const getSuperMethod_getFoo = bar.getSuperMethod_getFoo();
    getSuperMethod_getFoo().should.equal(bar);
    const onlyOnFoo = bar.getSuperMethod_onlyOnFoo();
    onlyOnFoo().should.equal(bar);


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
    Bar.prototype.getFoo;
    Bar.prototype.onlyOnBar;

    const bar = new Bar();
    const getFoo2 = bar.getFoo;
    const onlyOnBar = bar.onlyOnBar;
    getFoo2().should.equal(bar);
    onlyOnBar().should.equal(bar);

    barCount.should.equal(1);

    // check Foo after Bar since it was inherited by Bar and might accidentally
    // be bound to the instance of Foo above!
    Foo.prototype.getFoo;
    Foo.prototype.onlyOnFoo;

    const foo = new Foo();
    const getFoo1 = foo.getFoo;
    const onlyOnFoo = foo.onlyOnFoo;
    getFoo1().should.equal(foo);
    onlyOnFoo().should.equal(foo);

  });

  it('can be used to autobind the entire class at once', function () {
    // do not @autobind, which means start() should return `undefined` if
    // it is detached from the instance
    class Vehicle {
      start() {
        return this;
      }
    }

    @autobind
    class Car extends Vehicle {
      constructor() {
        super();
        this.name = 'amazing';
      }

      get color() {
        return 'red';
      }

      drive() {
        return this;
      }

      stop() {
        return this;
      }

      render() {
        return this;
      }
    }

    const originalRender = Car.prototype.render;
    Car.prototype.render = function () {
      return originalRender.apply(this, arguments);
    };

    Car.prototype.stop;
    Car.prototype.color;

    const car = new Car();
    car.render().should.equal(car);
    const { drive, stop, name, color, start } = car;
    expect(drive()).to.equal(car);
    drive().should.equal(car);
    stop().should.equal(car);
    name.should.equal('amazing');
    color.should.equal('red');

    // We didn't @autobind Vehicle
    expect(start()).to.be.undefined;
  });

  it('correctly binds with multiple class prototype levels', function () {
    @autobind
    class A {
      method() {
        return this.test || 'WRONG ONE';
      }
    }

    @autobind
    class B extends A {}

    @autobind
    class C extends B {
      test = 'hello';

      method() {
        return super.method();
      }
    }

    const c = new C();
    const { method } = c;
    method().should.equal('hello');

    const method2 = A.prototype.method;
    method2.call({ test: 'first' }).should.equal('first');

    const method3 = B.prototype.method;
    method3.call({ test: 'second' }).should.equal('second');
  });

  it('correctly binds class with symbol properties', function () {
    const parkHash = Symbol('park');

    @autobind
    class Car {
      [parkHash]() {
        return this;
      }
    }

    const car = new Car();
    const park = car[parkHash];
    park().should.equal(car);
  })
});
