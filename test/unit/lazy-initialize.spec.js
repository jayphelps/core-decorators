import { expect } from 'chai';
import { spy } from 'sinon';
import lazyInitialize from '../../lib/lazy-initialize';

describe('@lazyInitialize', function () {
  let initializer;

  class Foo {
    @lazyInitialize
    bar = initializer();
  }

  beforeEach(function () {
    initializer = spy(() => 'test');
  });

  afterEach(function () {
    initializer = null;
  });

  it('does not initialize property until it the getter is called', function () {
    const foo = new Foo();
    initializer.should.not.have.been.called;
    foo.bar.should.equal('test');
    foo.bar.should.equal('test');
    initializer.should.have.been.called.once;
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
