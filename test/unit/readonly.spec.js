import readonly from '../../lib/readonly';

describe('@readonly', function () {
  class Foo {
    @readonly
    first() {}

    @readonly
    second = 'second';
  }

  it('marks descriptor as writable === false', function () {
    Object.getOwnPropertyDescriptor(Foo.prototype, 'first')
      .writable.should.equal(false);
  });

  it('makes setting property error', function () {
    const foo = new Foo();

    (function () {
      foo.first = 'I will error';
    }).should.throw('Cannot assign to read only property \'first\' of object \'#<Foo>\'');
    
    (function () {
      foo.second = 'I will also error';
    }).should.throw('Cannot assign to read only property \'second\' of object \'#<Foo>\'');
  });
});
