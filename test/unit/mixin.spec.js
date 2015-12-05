import mixin from '../../lib/mixin';

const BarMixin = {
  stuff1: 'stuff1',

  getStuff2() {
    return 'stuff2';
  }
};

const OverrideMixin = {
  get stuff5() {
    return 'stuff5';
  },

  getStuff4() {
    return 'stuff4-override';
  }
};

function applyMixins(...mixins) {
  return @mixin(...mixins)
    class Foo {
      getStuff3() {
        return 'stuff3';
      }

      getStuff4() {
        return 'stuff4';
      }
    };
}

describe('@mixin', function () {
  it('throws if you do not provide at least one mixin', function () {
    (function () {
      var foo = @mixin class Bad {};
      console.error(foo);
    }).should.throw('@mixin() class Bad requires at least one mixin as an argument');

    (function () {
      @mixin()
      class Bad {}
    }).should.throw('@mixin() class Bad requires at least one mixin as an argument');
  });

  it('correctly adds a single mixin\'s descriptors', function () {
    const foo = new (applyMixins(BarMixin));

    foo.stuff1.should.equal('stuff1');
    foo.getStuff2().should.equal('stuff2');
    foo.getStuff3().should.equal('stuff3');
    foo.getStuff4().should.equal('stuff4');
  });

  it('correctly adds multiple mixins descriptors', function () {
    const foo = new (applyMixins(BarMixin, OverrideMixin));

    foo.stuff1.should.equal('stuff1');
    foo.getStuff2().should.equal('stuff2');
    foo.getStuff3().should.equal('stuff3');
    foo.getStuff4().should.equal('stuff4');
    foo.stuff5.should.equal('stuff5');
  });
});
