import { useFakeTimers } from 'sinon';
import throttle from '../../lib/throttle';

const defaultValue = {};

class Editor {
  value = defaultValue;
  counter = 0;

  @throttle(500)
  updateCounter1(value) {
    this.value = value;
    this.counter++;
  }

  @throttle(500, { leading: false, trailing: true })
  updateCounter2(value) {
    this.value = value;
    this.counter++;
  }

  @throttle(500, { leading: false, trailing: false })
  updateCounter3(value) {
    this.value = value;
    this.counter++;
  }
}

describe('@throttle', function () {
  let editor;
  let clock;

  beforeEach(function () {
    editor = new Editor();
    clock = useFakeTimers(Date.now());
  });

  afterEach(function () {
    clock.restore();
  })

  it('invokes function only once', function () {
    editor.updateCounter1(1);
    editor.counter.should.equal(1);

    clock.tick(600);

    editor.counter.should.equal(1);
    editor.value.should.equal(1);
  });

  it('invokes function only twice', function () {
    editor.updateCounter1(1);
    editor.updateCounter1(2);
    editor.updateCounter1(3);
    editor.updateCounter1(4);
    editor.counter.should.equal(1);
    editor.value.should.equal(1);

    clock.tick(600);

    editor.counter.should.equal(2);
    editor.value.should.equal(4);
  });

  it('invokes function delay and only once if "leading" option is false', function () {
    editor.updateCounter2(1);
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);

    clock.tick(400);

    // should still be 1 because 500ms hasn't yet passed
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);

    clock.tick(200);

    editor.counter.should.equal(1);
    editor.value.should.equal(1);
  });

   it('uses last arguments for leading: false, trailing: true (issue #94)', function () {
    editor.updateCounter2(1);
    editor.updateCounter2(2);
    editor.updateCounter2(3);
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);

    clock.tick(400);

    // should still be 1 because 500ms hasn't yet passed
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);

    clock.tick(200);

    editor.counter.should.equal(1);
    editor.value.should.equal(3);
  });

  it('does not invoke function if "leading" and "trailing" options are both false', function () {
    editor.updateCounter3(1);
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);

    clock.tick(400);

    // should still be 0 because leading call a canceled
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);
    editor.updateCounter3(2);

    clock.tick(200);

    // should still be 0 because trailing call a canceled
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);
  });

  it('does not share timers and args between instances', function () {
    let editor2 = new Editor();
    editor.updateCounter1(1);
    editor2.updateCounter1(2);

    editor.counter.should.equal(1);
    editor2.counter.should.equal(1);
    editor.value.should.equal(1);
    editor2.value.should.equal(2);

    clock.tick(600);

    editor.counter.should.equal(1);
    editor2.counter.should.equal(1);
    editor.value.should.equal(1);
    editor2.value.should.equal(2);
  });
});
