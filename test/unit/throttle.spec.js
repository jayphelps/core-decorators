import chai from 'chai';
import throttle from '../../lib/throttle';

class Editor {
  counter = 0;

  @throttle(500)
  updateCounter1() {
    this.counter++;
  }

  @throttle(500, false)
  updateCounter2() {
    this.counter++;
  }

  @throttle(500, false, false)
  updateCounter3() {
    this.counter++;
  }
}

describe('@throttle', function () {
  let editor;

  beforeEach(function () {
    editor = new Editor();
  });

  it('invokes function only once', function (done) {
    editor.updateCounter1();
    editor.counter.should.equal(1);

    setTimeout(() => {
      editor.counter.should.equal(1);
      done();
    }, 600);
  });

  it('invokes function only twice', function (done) {
    editor.updateCounter1();
    editor.updateCounter1();
    editor.updateCounter1();
    editor.updateCounter1();
    editor.counter.should.equal(1);

    setTimeout(() => {
      editor.counter.should.equal(2);
      done();
    }, 600);
  });

  it('invokes function delay and only once if "leading" option is false', function (done) {
    editor.updateCounter2();
    editor.counter.should.equal(0);

    // should still be 1 because 500ms hasn't yet passed
    setTimeout(() => {
      editor.counter.should.equal(0);
    }, 400);

    setTimeout(() => {
      editor.counter.should.equal(1);
      done();
    }, 600);
  });

  it('not invokes function if "leading" and "trailing" options are both false', function (done) {
    editor.updateCounter3();
    editor.counter.should.equal(0);

    // should still be 1 because 500ms hasn't yet passed
    setTimeout(() => {
      editor.counter.should.equal(0);
    }, 400);

    setTimeout(() => {
      editor.counter.should.equal(0);
      done();
    }, 600);
  });

  it('separate instances do not share timers', function (done) {
    let editor2 = new Editor();
    editor.updateCounter1();
    editor2.updateCounter1();

    editor.counter.should.equal(1);
    editor2.counter.should.equal(1);

    setTimeout(() => {
      editor.counter.should.equal(1);
      editor2.counter.should.equal(1);
      done();
    }, 600);
  });
});
