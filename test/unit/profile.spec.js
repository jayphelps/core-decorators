import { spy } from 'sinon';
import applyDecorators from '../../lib/applyDecorators';
import profile, { defaultConsole } from '../../lib/profile';

const CONSOLE_PROFILE = defaultConsole.profile;
const CONSOLE_PROFILEEND = defaultConsole.profileEnd;
const CONSOLE_WARN = defaultConsole.warn;

profile.__enabled = true;

describe('@profile', function() {
  class Foo {
    @profile
    profiled() {
      return 'profiled';
    }

    @profile('foo')
    profiledPrefix() {
      return;
    }

    @profile(null, true)
    profileOnce() {
      return;
    }

    unprofiled() {
      return;
    }

    @profile
    iThrowAnError() {
      throw 'foobar';
    }
  };

  let profileSpy;
  let profileEndSpy;
  let warnSpy;

  beforeEach(function () {
    profileSpy = defaultConsole.profile = spy();
    profileEndSpy = defaultConsole.profileEnd = spy();
    warnSpy = defaultConsole.warn = spy();
  });

  afterEach(function () {
    defaultConsole.profile = CONSOLE_PROFILE;
    defaultConsole.profileEnd = CONSOLE_PROFILEEND;
    defaultConsole.warn = CONSOLE_WARN;
  });

  it('calls console.profile and console.profileEnd', function() {
    new Foo().profiled();
    profileSpy.called.should.equal(true);
    profileEndSpy.called.should.equal(true);
  });

  it('calls console.profile and console.profileEnd once when flag is on', function() {
    const foo = new Foo();
    foo.profileOnce();
    foo.profileOnce();

    profileSpy.calledOnce.should.equal(true);
  });

  it('calls console.profileEnd even if the called method throws', function() {
    try {
      new Foo().iThrowAnError();
    } catch (e) {
      e.should.equal('foobar');
    }

    profileSpy.called.should.equal(true);
    profileEndSpy.called.should.equal(true);
  });

  it('uses class and method names for a default prefix', function() {
    let labelPattern = new RegExp('Foo\\.profiled');
    let label;
    new Foo().profiled();
    label = profileSpy.getCall(0).args[0];
    label.should.match(labelPattern);
  });

  it('uses a supplied prefix for the label', function() {
    new Foo().profiledPrefix();
    profileSpy.getCall(0).args[0].should.match(/^foo/);
    profileEndSpy.getCall(0).args[0].should.match(/^foo/);
  });

  it('supports a custom profileation object', function() {
    let profileCalled = false;
    let profileEndCalled = false;

    let myConsole = {
      profile(label) {
        profileCalled = true;
      },
      profileEnd(label) {
        profileEndCalled = true;
      }
    }

    class Boo {
      @profile('custom', false, myConsole)
      hoo() {
        return;
      }
    }
    new Boo().hoo();
    profileCalled.should.equal(true);
    profileEndCalled.should.equal(true);
  });

  it('returns the value', function() {
    let foo = new Foo();
    let result = foo.profiled();
    result.should.equal('profiled');
  });

  describe('when disabled', function() {
    class Bar {
      disabledProfile() {
        return;
      }
    }

    beforeEach(function() {
      profile.__enabled = false;
    });

    afterEach(function() {
      profile.__enabled = true;
    });

    it('should send a warning', function() {
      profile.__warned = false;

      applyDecorators(Bar, {
        disabledProfile: [profile]
      });

      warnSpy.called.should.equal(true);
    });

    it('should leave descriptor alone', function() {
      const oldBarDisabledProfile = Bar.prototype.disabledProfile = spy();

      applyDecorators(Bar, {
        disabledProfile: [profile]
      });

      Bar.prototype.disabledProfile.should.equal(oldBarDisabledProfile);
    });
  })

});
