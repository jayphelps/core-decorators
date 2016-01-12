import { spy } from 'sinon';
import time from '../../lib/time';

const CONSOLE_TIME = console.time;
const CONSOLE_TIMEEND = console.timeEnd;

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
  };

  let timeSpy;
  let timeEndSpy;

  beforeEach(function () {
    timeSpy = console.time = spy();
    timeEndSpy = console.timeEnd = spy();
  });

  afterEach(function () {
    console.time = CONSOLE_TIME;
    console.timeEnd = CONSOLE_TIMEEND;
  });

  it('calls console.time and console.timeEnd', function() {
    new Foo().timed();
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

  it('uses a default timeation object if console.time is not available', function() {
    const LOG_NATIVE = console.log;
    let logSpy = console.log = spy();
    console.time = null;
    console.timeEnd = null;
    new Foo().timed();
    logSpy.called.should.equal(true);
    console.log = LOG_NATIVE;
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
