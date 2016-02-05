import before from '../../lib/before';

describe('@before', function () {
  let Foo;
  let order = [];

  beforeEach(function () {

    function fn() {
      order.push(0);
    };

    Foo = class Foo {
      @before(fn)
      suchWow() {        
        order.push(1);
        return order;
      }      
    }
  });

  it('check functions call ordering', function () {
    const foo = new Foo();
    
    foo.suchWow().should.eql([0,1]);

  });

  it('parameter is a promise', function() {

    const p = new Promise(function(resolve, reject) {            
      resolve({data: 'ok'});      
    });

    const Foo = class Foo {
      @before(p)
      suchWow(resolveValue) {          
        ({data: 'ok'}).should.equal(resolveValue);        
      }
    }

    const foo = new Foo();
    foo.suchWow();

  });

  it('check parameter is a function or promise', function () {
    
    (function () {
      const FooError = class Foo {
        @before('string')
        suchWow() {}
      }

      const foo = new FooError();    
      foo.suchWow();

    }).should.throw('@before need a function or a promise in parameter, not: string');    

  });
});
