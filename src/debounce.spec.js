import chai from 'chai';
import debounce from './debounce';

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

describe('debounce', function () {
  let editor;

  beforeEach(function () {
    editor = new Editor();
  });

  it('invokes function only once', function (done) {
    editor.updateCounter1();
    editor.counter.should.equal(0);

    setTimeout(() => {
      editor.counter.should.equal(1);
      done();
    }, 600);
  });

  it('invokes function immediately and only once if "immediate" option is true', function (done) {
    editor.updateCounter2();
    editor.counter.should.equal(1);

    // should still be 1 because 600ms hasn't yet passed
    setTimeout(() => {
      editor.counter.should.equal(1);
    }, 400);

    setTimeout(() => {
      editor.counter.should.equal(1);
      done();
    }, 600); 
  });

  it('Separate instances do not share timers', function (done) {
    let editor2 = new Editor();
    editor.updateCounter1();
    editor2.updateCounter1();

    setTimeout(() => {
      editor.counter.should.equal(1);
      editor2.counter.should.equal(1);
      done();
    }, 600);
  });
});
