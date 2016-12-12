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

  beforeEach(function () {
    editor = new Editor();
  });

  it('invokes function only once', function (done) {
    editor.updateCounter1(1);
    editor.counter.should.equal(1);

    setTimeout(() => {
      editor.counter.should.equal(1);
      editor.value.should.equal(1);
      done();
    }, 600);
  });

  it('invokes function only twice', function (done) {
    editor.updateCounter1(1);
    editor.updateCounter1(2);
    editor.updateCounter1(3);
    editor.updateCounter1(4);
    editor.counter.should.equal(1);
    editor.value.should.equal(1);

    setTimeout(() => {
      editor.counter.should.equal(2);
      editor.value.should.equal(4);
      done();
    }, 600);
  });

  it('invokes function delay and only once if "leading" option is false', function (done) {
    editor.updateCounter2(1);
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);

    // should still be 1 because 500ms hasn't yet passed
    setTimeout(() => {
      editor.counter.should.equal(0);
      editor.value.should.equal(defaultValue);
    }, 400);

    setTimeout(() => {
      editor.counter.should.equal(1);
      editor.value.should.equal(1);
      done();
    }, 600);
  });

   it('uses last arguments for leading: false, trailing: true (issue #94)', function (done) {
    editor.updateCounter2(1);
    editor.updateCounter2(2);
    editor.updateCounter2(3);
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);

    // should still be 1 because 500ms hasn't yet passed
    setTimeout(() => {
      editor.counter.should.equal(0);
      editor.value.should.equal(defaultValue);
    }, 400);

    setTimeout(() => {
      editor.counter.should.equal(1);
      editor.value.should.equal(3);
      done();
    }, 600);
  });

  it('does not invoke function if "leading" and "trailing" options are both false', function (done) {
    editor.updateCounter3(1);
    editor.counter.should.equal(0);
    editor.value.should.equal(defaultValue);

    // should still be 0 because leading call a canceled
    setTimeout(() => {
      editor.counter.should.equal(0);
      editor.value.should.equal(defaultValue);
      editor.updateCounter3(2);
    }, 400);

    // should still be 0 because trailing call a canceled
    setTimeout(() => {
      editor.counter.should.equal(0);
      editor.value.should.equal(defaultValue);
      done();
    }, 600);
  });

  it('does not share timers and args between instances', function (done) {
    let editor2 = new Editor();
    editor.updateCounter1(1);
    editor2.updateCounter1(2);

    editor.counter.should.equal(1);
    editor2.counter.should.equal(1);
    editor.value.should.equal(1);
    editor2.value.should.equal(2);

    setTimeout(() => {
      editor.counter.should.equal(1);
      editor2.counter.should.equal(1);
      editor.value.should.equal(1);
      editor2.value.should.equal(2);
      done();
    }, 600);
  });
});
