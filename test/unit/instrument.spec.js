import { spy } from 'sinon';
import instrument from '../../lib/instrument';

const CONSOLE_TIME = console.time;
const CONSOLE_TIMEEND = console.timeEnd;

describe('@instrument', function() {
  class Foo {
    @instrument
    instrumented() {
      return;
    }

    @instrument('foo')
    instrumentedPrefix() {
      return;
    }

    uninstrumented() {
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
    new Foo().instrumented();
    timeSpy.called.should.equal(true);
    timeEndSpy.called.should.equal(true);
  });

  it('creates a unique label with a counter', function() {
    let dashNum = new RegExp('.*-(\\d+)$');
    let firstNum;
    let secondNum;
    new Foo().instrumented();
    new Foo().instrumentedPrefix();
    firstNum = parseInt(timeSpy.getCall(0).args[0].replace(dashNum, '$1'), 10);
    secondNum = parseInt(timeSpy.getCall(1).args[0].replace(dashNum, '$1'), 10);
    secondNum.should.equal(firstNum + 1);
  });

  it('uses a supplied prefix for the label', function() {
    new Foo().instrumentedPrefix();
    timeSpy.getCall(0).args[0].should.match(/^foo-/);
    timeEndSpy.getCall(0).args[0].should.match(/^foo-/);
  });

  it('uses a default instrumentation object if console.time is not available', function() {
    const LOG_NATIVE = console.log;
    let logSpy = console.log = spy();
    console.time = null;
    console.timeEnd = null;
    new Foo().instrumented();
    logSpy.called.should.equal(true);
    console.log = LOG_NATIVE;
  });

  it('supports a custom log function', function() {
    let logged = false;

    let myConsole = {
      log() {
        logged = true;
      }
    };

    class Boo {
      @instrument('custom', myConsole)
      hoo() {
        return;
      }
    }

    new Boo().hoo();
    logged.should.equal(true);
  })

  it('supports a custom instrumentation object', function() {
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
      @instrument('custom', myConsole)
      hoo() {
        return;
      }
    }
    new Boo().hoo();
    timeCalled.should.equal(true);
    timeEndCalled.should.equal(true);
  });

});
