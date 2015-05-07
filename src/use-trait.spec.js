import expect from 'must';

import useTrait from './use-trait';

// ===================================================================

const symbol = Symbol;

// This is a trait declared with a plain objects.
const Button = {
  click () {
    return true;
  },

  get [symbol] () {
    return true;
  }
};

// This is a trait declared with a class (allows the definition of
// static members).
class Circle {
  static get PI () {
    return Math.PI;
  }

  // Make it non instanciable.
  constructor () {
    throw new Error('a trait cannot be instanciated');
  }

  get area () {
    const {radius} = this;
    return Circle.PI * radius * radius;
  }
}

@useTrait(Button)
@useTrait(Circle)
class CircleButton {
  constructor (radius) {
    this.radius = radius;
  }
}

// ===================================================================

describe('useTrait', function () {
  it('copies class values', function () {
    expect(CircleButton.PI).to.equal(Math.PI);
  })

  it('copies instance values', function () {
    const btn = new CircleButton(1);

    // Getter.
    expect(btn.area).to.equal(Math.PI);

    // Function.
    expect(btn.click()).to.be.true();

    // Symbol.
    expect(btn[symbol]).to.be.true();
  })

  it('does not overwrite members', function () {
    expect(() => {
      @useTrait(Button)
      class Foo {
        click () {}
      }
    }).to.throw()
  })
})
