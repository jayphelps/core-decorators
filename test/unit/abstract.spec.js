import abstract from '../../lib/abstract';

class Base {
  name = 'base';

  constructor(value) {
    this.value = value;
  }

  @abstract
  static whois(instance) {}

  @abstract
  speak() {}
}

describe('@abstract', function () {
  it('throws error when trying to invoke abstract static method', function () {
    (function () {
      Base.whois();
    }).should.throw('Base must implement abstract method whois()');
  });
  it('throws error when trying to invoke abstract instance method', function () {
    (function () {
      new Base().speak();
    }).should.throw('Base must implement abstract method speak()');
  });
  it('throws when trying to instantiate decorated class', function () {
    @abstract
    class FirstBase extends Base {
    }
    (function () {
      new FirstBase();
    }).should.throw('abstract class FirstBase cannot be instantiated');
  });
  it('throws when trying to instantiate concrete class derived from abstract class not implementing abstract properties', function () {
    @abstract
    class FirstBase extends Base {
    }
    class SecondBase extends FirstBase {
    }
    (function () {
      new SecondBase();
    }).should.throw('abstract class SecondBase cannot be instantiated\ndid you forget to decorate using @abstract?');
  });
  it('must support super calls on concrete class that implements all abstract properties', function () {
    class Concrete extends Base {
        constructor() {
          super(1);
        }

        static whois(instance) {}

        speak() {}
    }
    let concrete = new Concrete();
    concrete.value.should.equal(1);
    concrete.name.should.equal('base');
  });
  it('must throw when user decorates instance property', function () {
    (function () {
      class Unsupported {
        @abstract
        touched;
      }
    }).should.throw('@abstract can only be used on classes and methods');
  });
  it('must throw when user decorates getter', function () {
    (function () {
      class Unsupported {
        @abstract
        get value() {}
        set value(v) {}
      }
    }).should.throw('@abstract can only be used on classes and methods');
  });
  it('must throw when user decorates getter', function () {
    (function () {
      class Unsupported {
        get value() {}
        @abstract
        set value(v) {}
      }
    }).should.throw('@abstract can only be used on classes and methods');
  });
});
