import { lazyInitialize } from '../..'

const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const { spy } = sinon;

chai.should();
chai.use(sinonChai);


describe('@lazyInitialize', function () {
  let initializer, initializer2, Foo;

  beforeEach(function () {
    initializer = spy(() => 'test' );
    initializer2 = spy(() => 'test' );

    if (process.env.TEST_MODE === 'babel') {
      class CFoo {
        @lazyInitialize
        bar = initializer();

        @lazyInitialize(initializer2,1,2,3)
        bar2 = {};
      }
      Foo = CFoo;
    } else {
      class TSFoo {
        @lazyInitialize(initializer)
        bar;

        @lazyInitialize(initializer2,1,2,3)
        bar2;
      }
      Foo = TSFoo;
    }
  });

  afterEach(function () {
    initializer = null;
    initializer2 = null;
  });

  it('does not initialize property until it the getter is called', function () {
    const foo = new Foo();
    initializer.should.not.have.been.called;
    initializer2.should.not.have.been.called;
    foo.bar.should.equal('test');
    foo.bar.should.equal('test');
    foo.bar2.should.equal('test');
    foo.bar2.should.equal('test');
    initializer.should.have.been.called.once;
    expect(initializer2.calledOnceWithExactly(1,2,3)).to.be.true;
  });

  it('allows normal reassignment', function () {
    const foo = new Foo();
    foo.bar = 'test';
    initializer.should.not.have.been.called;
    foo.bar.should.equal('test');
  });

  it('does not initialize property when looked up on the prototype directly', function () {
    const value = Foo.prototype.bar;
    initializer.should.not.have.been.called;
    expect(value).to.be.undefined;
  });
});
