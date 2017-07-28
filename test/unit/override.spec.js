import override from '../../lib/override';

class Parent {
  speak(first, second) {}
}

describe('@override', function () {
  it('throws error when signature does not match', function () {
    (function () {
      class Child extends Parent {
        @override
        speak() {}
      }
    }).should.throw('Child#speak() does not properly override Parent#speak(first, second)');
  });

  it('throws error when no is matching name is found', function () {
    (function () {
      class Child extends Parent {
        @override
        wow() {}
      }
    }).should.throw('No descriptor matching Child#wow() was found on the prototype chain.');
  });

  it('throws error when no is matching name is found but suggests a closely named method if exists', function () {
    (function () {
      class Child extends Parent {
        @override
        speaks() {}
      }
    }).should.throw('No descriptor matching Child#speaks() was found on the prototype chain.\n\n  Did you mean "speak"?');
  });

  it('does not throw an error when signatures match', function () {
    (function () {
      class Child extends Parent {
        @override
        speak(first, second) {}
      }
    }).should.not.throw();
  });
});
