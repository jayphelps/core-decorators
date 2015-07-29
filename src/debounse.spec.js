import expect from 'must';

import debounce from './debounce';

// ===================================================================

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

// ===================================================================

describe('debounce', function () {

  let editor;

  beforeEach(function() {
    editor = new Editor();
  });

  it('invokes function only once', function (done) {

    editor.updateCounter1();
    expect(editor.counter).to.equal(0);

    setTimeout(() => {
      expect(editor.counter).to.equal(1);
      done();
    }, 600);
  });

  it('invokes function immediately and only once if "immediate" option is true', function (done) {

    editor.updateCounter2();
    expect(editor.counter).to.equal(1);

    setTimeout(() => {
      expect(editor.counter).to.equal(1);
      done();
    }, 400);
  });

})