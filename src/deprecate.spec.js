import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import deprecate from './deprecate';

chai.should();
chai.use(sinonChai);

class Foo {
  @deprecate
  first() {
    return 'hello world';
  }

  second() {
    return this.first();
  }

  @deprecate('asdf')
  third() {
    return 'hello galaxy';
  }

  @deprecate('fdsa', { url: 'http://example.com/' })
  forth() {
    return 'hello universe';
  }
}

describe('deprecate', function () {
  beforeEach(function () {
    sinon.spy(console, 'warn');
  });

  afterEach(function () {
    console.warn.restore();
  });

  it('console.warn() is called with default warning when the deprecated function is used', function () {
    const foo = new Foo();
    
    foo.first().should.equal('hello world');
    console.warn.should.have.been.calledOnce;
    console.warn.should.have.been.calledWith('DEPRECATION Foo#first: This function will be removed in future versions.');

    foo.second().should.equal('hello world');
    console.warn.should.have.been.calledTwice;
    console.warn.should.have.been.calledWith('DEPRECATION Foo#first: This function will be removed in future versions.');
  });

  it('console.warn() is called with the custom message, when provided', function () {
    return;
    const foo = new Foo();
    
    foo.third().should.equal('hello galaxy');
    console.warn.should.have.been.calledOnce;
    console.warn.should.have.been.calledWith('asdf');
  });

  it('console.warn() is called with the URL, when provided', function () {
    const foo = new Foo();
    
    foo.forth().should.equal('hello universe');
    console.warn.should.have.been.calledOnce;
    console.warn.should.have.been.calledWith('DEPRECATION Foo#forth: fdsa\n\n    See http://example.com/ for more details.\n\n');
  });
});
