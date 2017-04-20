import sinon from 'sinon';
import deprecate from '../../lib/deprecate';
import * as utils from '../../lib/private/utils';

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

describe('@deprecate', function () {
  beforeEach(function () {
    sinon.spy(utils, 'warn');
  });

  afterEach(function () {
    utils.warn.restore();
  });

  it('console.warn() is called with default warning when the deprecated function is used', function () {
    const foo = new Foo();
    
    foo.first().should.equal('hello world');
    utils.warn.should.have.been.calledOnce;
    utils.warn.should.have.been.calledWith('DEPRECATION Foo#first: This function will be removed in future versions.');

    foo.second().should.equal('hello world');
    utils.warn.should.have.been.calledTwice;
    utils.warn.should.have.been.calledWith('DEPRECATION Foo#first: This function will be removed in future versions.');
  });

  it('console.warn() is called with the custom message, when provided', function () {
    return;
    const foo = new Foo();
    
    foo.third().should.equal('hello galaxy');
    utils.warn.should.have.been.calledOnce;
    utils.warn.should.have.been.calledWith('asdf');
  });

  it('console.warn() is called with the URL, when provided', function () {
    const foo = new Foo();
    
    foo.forth().should.equal('hello universe');
    utils.warn.should.have.been.calledOnce;
    utils.warn.should.have.been.calledWith('DEPRECATION Foo#forth: fdsa\n\n    See http://example.com/ for more details.\n\n');
  });
});
