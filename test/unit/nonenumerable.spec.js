import { nonenumerable } from 'core-decorators';
import skipTypescriptTest from './skipTypescriptTest';

describe('@nonenumerable', function() {
  class Foo {
    @nonenumerable
    bar = 'test';
  }

  it('is not enumerable', function() {
    if (skipTypescriptTest(this)) return;
    const foo = new Foo();
    Object.getOwnPropertyDescriptor(foo, 'bar').enumerable.should.equal(false);
  });
});
