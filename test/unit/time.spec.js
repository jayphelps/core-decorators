import { spy } from 'sinon';
import time, { defaultConsole } from '../../lib/time';

const CONSOLE_TIME = defaultConsole.time;
const CONSOLE_TIMEEND = defaultConsole.timeEnd;

describe('@time', function() {
  class Foo {
    @time
    timed() {
      return 'timed';
    }

    @time('foo')
    timedPrefix() {
      return;
    }

    untimed() {
      return;
    }

    @time
    iThrowAnError() {
      throw 'foobar';
    }
  };

  let timeSpy;
  let timeEndSpy;

  beforeEach(function () {
    timeSpy = defaultConsole.time = spy();
    timeEndSpy = defaultConsole.timeEnd = spy();
  });

  afterEach(function () {
    defaultConsole.time = CONSOLE_TIME;
    defaultConsole.timeEnd = CONSOLE_TIMEEND;
  });

  it('calls console.time and console.timeEnd', function() {
    new Foo().timed();
    timeSpy.called.should.equal(true);
    timeEndSpy.called.should.equal(true);
  });

  it('calls console.timeEnd even if the called method throws', function() {
    try {
      new Foo().iThrowAnError();
    } catch (e) {
      e.should.equal('foobar');
    }

    timeSpy.called.should.equal(true);
    timeEndSpy.called.should.equal(true);
  });

  it('uses class and method names for a default prefix', function() {
    let labelPattern = new RegExp('Foo\\.timed-\\d+');
    let label;
    new Foo().timed();
    label = timeSpy.getCall(0).args[0];
    label.should.match(labelPattern);
  });

  it('creates a unique label with a counter', function() {
    let dashNum = new RegExp('.*-(\\d+)$');
    let firstNum;
    let secondNum;
    new Foo().timed();
    new Foo().timedPrefix();
    firstNum = parseInt(timeSpy.getCall(0).args[0].replace(dashNum, '$1'), 10);
    secondNum = parseInt(timeSpy.getCall(1).args[0].replace(dashNum, '$1'), 10);
    secondNum.should.equal(firstNum + 1);
  });

  it('uses a supplied prefix for the label', function() {
    new Foo().timedPrefix();
    timeSpy.getCall(0).args[0].should.match(/^foo-/);
    timeEndSpy.getCall(0).args[0].should.match(/^foo-/);
  });

  it('supports a custom timeation object', function() {
    let timeCalled = false;
    let timeEndCalled = false;

    let myConsole = {
      time(label) {
        timeCalled = true;
      },
      timeEnd(label) {
        timeEndCalled = true;
      }
    }

    class Boo {
      @time('custom', myConsole)
      hoo() {
        return;
      }
    }
    new Boo().hoo();
    timeCalled.should.equal(true);
    timeEndCalled.should.equal(true);
  });

  it('returns the value', function() {
    let foo = new Foo();
    let result = foo.timed();
    result.should.equal('timed');
  });

});
