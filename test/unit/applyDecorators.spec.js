import {applyDecorators, autobind, readonly, enumerable} from 'core-decorators';

describe('applyDecorators() helper', function () {
  class Foo {
    first () {
      return this;
    }

    second () {
      return this;
    }
  }

  applyDecorators(Foo, {
    first: [autobind],
    second: [readonly, enumerable]
  });

  it('applies the decorators to the provided prop\'s descriptors', function () {
    const foo = new Foo();

    const { first } = foo;
    first().should.equal(foo);
    foo.second().should.equal(foo);

    (function () {
      // @ts-ignore 
      foo.second = 'I will error';
    }).should.throw('Cannot assign to read only property \'second\' of object \'#<Foo>\'');

    Object.getOwnPropertyDescriptor(Foo.prototype, 'second')
      .writable.should.equal(false);

    Object.getOwnPropertyDescriptor(Foo.prototype, 'second')
      .enumerable.should.equal(true);
  });
});
