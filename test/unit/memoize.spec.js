import { stub } from 'sinon';
import memoize from '../../lib/memoize';

describe('@memoize', function () {
  var Foo, work, run;

  beforeEach(function () {
    work = null;
    Foo = class Foo {
      @memoize
      bar(...args){
        return work(...args);
      }
    };

    run = function (id, shouldCall, shouldReturn, args) {
      var inst = new Foo();
      work = stub().returns(id);
      var ret = inst.bar.apply(inst, args);

      work.called.should.equal(shouldCall, `case ${id} should ${shouldCall ? '' : 'not '}be called`);
      ret.should.equal(shouldReturn, `case ${id} should return ${shouldReturn}`);
    };
  });

  it('works for 0 arguments', function () {
    run('a', true, 'a', []);
    run('b', false, 'a', []);
  });

  it('works for 1 string argument', function () {
    run('a', true, 'a', ['x']);
    run('b', false, 'a', ['x']);
    run('c', true, 'c', ['y']);
    run('b', false, 'a', ['x']);
  });

  it('works for 3 string arguments', function () {
    run('a', true, 'a', ['x', 'y', 'z']);
    run('b', false, 'a', ['x', 'y', 'z']);
    run('c', true, 'c', ['x', 'q', 'z']);
    run('d', true, 'd', ['q', 'y', 'z']);
    run('e', true, 'e', ['x', 'y', 'q']);
  });

  it('works for variable string arguments', function () {
    run('a', true, 'a', ['x']);
    run('b', true, 'b', ['x', 'y']);
    run('c', false, 'a', ['x']);
    run('d', false, 'b', ['x', 'y']);
    run('e', true, 'e', []);
  });
});
