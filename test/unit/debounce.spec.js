import { useFakeTimers } from 'sinon';
import debounce from '../../lib/debounce';

class Editor {
  counter = 0;

  @debounce(500)
  updateCounter1() {
    this.counter++;
  }

  @debounce(500, true)
  updateCounter2() {
    this.counter++;
  }
}

describe('@debounce', function () {
  let editor;
  let clock;

  beforeEach(function () {
    editor = new Editor();
    clock = useFakeTimers(Date.now());
  });

  afterEach(function () {
    clock.restore();
  });

  it('invokes function only once', function () {
    editor.updateCounter1();
    editor.counter.should.equal(0);

    clock.tick(600);

    editor.counter.should.equal(1);
  });

  it('invokes function immediately and only once if "immediate" option is true', function () {
    editor.updateCounter2();
    editor.counter.should.equal(1);

    clock.tick(400);

    editor.counter.should.equal(1);

    clock.tick(200);

    editor.counter.should.equal(1);
  });

  it('does not share timers between instances', function () {
    let editor2 = new Editor();
    editor.updateCounter1();
    editor2.updateCounter1();

    clock.tick(600);

    editor.counter.should.equal(1);
    editor2.counter.should.equal(1);
  });
});
