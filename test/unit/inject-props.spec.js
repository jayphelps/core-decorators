require('../test.spec');
import injectProps from '../../lib/inject-props';

describe('@injectProps', () => {
  class Person {
    constructor(props) {
      this.props = props;
    }

    state = { clickCount: 1 };
    attributes = { firstName: 'John', lastName: 'Snow' };

    @injectProps('state', 'attributes')
    fullName({ clickCount } , { firstName, lastName }, title = 'Knight') {
      return `${title} ${firstName} ${lastName} (${clickCount})`;
    }

    @injectProps
    render({ title }) {
      return this.fullName(title);
    }
  }

  it('no args defaults to "this.props"', () => {
    new Person({ title: 'Sir' }).render().should.equal('Sir John Snow (1)');
  });

  it("injects the selected properties before the method's parameters, to allow optional ones", () => {
    new Person().fullName().should.equal('Knight John Snow (1)');
  });

  it('throws if not applied to a function', function () {
    (function () {
      class Person {
        @injectProps
        name = 'John Snow';
      }
    }).should.throw('@injectProps can only be used on functions');
  });
});
