import before from '../../lib/before';

describe('@before', function () {
  let Foo;
  const order = [];

  beforeEach(function () {
    function fn() {
      order.push(0);
    };

    Foo = class Foo {
      @before(fn)
      suchWow() {
        order.push(1);
      }
    }
  });

  it('check functions call ordering', function () {
    const foo = new Foo();

    foo.suchWow();    
    order.should.eql([0,1]);
  });  
});
