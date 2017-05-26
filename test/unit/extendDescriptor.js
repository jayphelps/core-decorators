import extendDescriptor from '../../lib/extendDescriptor';
import enumerable from '../../lib/enumerable';
import nonenumerable from '../../lib/nonenumerable';

describe('@extendDescriptor', function () {
  class Base {
    get first() {
      return this._first;
    }

    set second(value) {
      this._second = value;
    }

    set third(value) {
      throw new Error('should not be called');
    }

    @nonenumerable
    fourth = 'fourth';

    @enumerable
    fifth() {
      throw new Error('should not be called');
    }
  }

  class Middle extends Base {}

  class Derived extends Middle {
    @extendDescriptor
    set first(value) {
      this._first = value;
    }

    @extendDescriptor
    get second() {
      return this._second;
    }

    @extendDescriptor
    get third() {
      return this._third;
    }

    set third(value) {
      this._third = value;
    }

    @extendDescriptor
    fourth = 'fourth';

    @extendDescriptor
    fifth() {
      return 'fifth';
    }
  }

  let derived;

  beforeEach(() => {
    derived = new Derived();
  });

  afterEach(() => {
    derived = null;
  });

  it('extends getters/setters', function () {
    derived.first = 'first';
    derived.first.should.equal('first');

    derived.second = 'second';
    derived.second.should.equal('second');

    derived.third = 'third';
    derived.third.should.equal('third');
  });

  it('extends property initializers', function () {
    const descriptor = Object.getOwnPropertyDescriptor(Derived.prototype, 'fourth');
    descriptor.enumerable.should.equal(false);

    derived.fourth.should.equal('fourth');
  });

  it('extends property methods', function () {
    const descriptor = Object.getOwnPropertyDescriptor(Derived.prototype, 'fifth');
    descriptor.enumerable.should.equal(true);

    derived.fifth().should.equal('fourth');
  });
});
