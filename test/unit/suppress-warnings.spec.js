import { spy } from 'sinon';
import suppressWarnings from '../../lib/suppress-warnings';

const CONSOLE_WARN = console.warn;

describe('@suppressWarnings', function () {
  class Foo {
    @suppressWarnings
    suppressed(){
      console.warn('a');
    }

    unsuppressed(){
      console.warn('b');
    }
  }

  var warnSpy;
  beforeEach(function () {
    warnSpy = console.warn = spy();
  });

  afterEach(function () {
    console.warn = CONSOLE_WARN;
  });

  it('suppresses warns', function () {
    new Foo().suppressed();
    warnSpy.called.should.equal(false);
  });

  it('restores the original console.warn', function () {
    new Foo().suppressed();
    new Foo().unsuppressed();
    warnSpy.called.should.equal(true);
    console.warn.should.equal(warnSpy);
  });
});
