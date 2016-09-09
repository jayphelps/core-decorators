import extendDescriptor from '../../lib/extendDescriptor';
import enumerable from '../../lib/enumerable';
import nonenumerable from '../../lib/nonenumerable';


/*
TODO

static property getters/setters
static methods
static initialized properties
*/

describe('@extendDescriptor', function () {
  class Base {
    @nonenumerable
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

    static set sixth(value) {
      this._sixth = value;
    }

    @nonenumerable
    static seventh = 'seventh';
  }

  class Middle extends Base {
    constructor() {
      super();
      super.second = 'never used';
    }

    get second() {
      return this._middleSecond;
    }
    set second(value) {
      this._middleSecond = value;
    }
  }

  class Derived extends Middle {
    @extendDescriptor
    set first(value) {
      this._first = value;
    }

    @extendDescriptor
    get second() {
      return super.second;
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

    @extendDescriptor
    static get sixth() {
      return this._sixth;
    }

    @extendDescriptor
    static seventh = 'seventh';
  }

  let derived;

  beforeEach(() => {
    derived = new Derived();
  });

  afterEach(() => {
    derived = null;
  });

  it('extends getters/setters', function () {
    Object.getOwnPropertyDescriptor(Derived.prototype, 'first')
      .enumerable.should.equal(false);

    derived.first = 'first';
    derived.first.should.equal('first');

    derived.second = 'second';
    derived.second.should.equal('second');
    derived._second.should.equal('never used');

    derived.third = 'third';
    derived.third.should.equal('third');

    Derived.sixth = 'sixth';
    Derived._sixth.should.equal('sixth');
  });

  it('does not extend initialized instance property but silently ignores the error', function () {
    Object.getOwnPropertyDescriptor(new Derived(), 'fourth')
      .enumerable.should.equal(true);
  });

  it('extends initialized static property', function () {
    Object.getOwnPropertyDescriptor(Derived, 'seventh')
      .enumerable.should.equal(false);
  });

  it('extends property methods', function () {
    Object.getOwnPropertyDescriptor(Derived.prototype, 'fifth')
      .enumerable.should.equal(true);

    derived.fifth().should.equal('fifth');
  });
});
