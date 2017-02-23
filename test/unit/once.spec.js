import once from '../../lib/once';

describe('@once', function () {

  class Foo {

    @once
    runSumOnlyOnce(num1, num2) {
      return num1 + num2;
    }
  }

  it('should return the value of the first run only', function () {
    const foo = new Foo();

    let firstRun = foo.runSumOnlyOnce(1, 2);
    firstRun.should.equal(3);

    let secondRun = foo.runSumOnlyOnce(4, 5);
    secondRun.should.equal(firstRun);

  });
});
