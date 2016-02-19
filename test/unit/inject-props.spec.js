require('../test.spec');
import injectProps from '../../lib/inject-props';

describe('@injectProps', () => {
  class Person {
    constructor(props) {
      this.props = props;
    }

    state = { firstName: 'John', lastName: 'Snow' };

    @injectProps('state')
    fullName({ firstName, lastName }, title = 'Knight') {
      return `${title} ${firstName} ${lastName}`;
    }

    @injectProps
    render({ title }) {
      return this.fullName(title);
    }
  }

  it('no args defaults to "this.props"', () => {
    new Person({ title: 'Sir' }).render().should.equal('Sir John Snow');
  });

  it('injects the property as the 1st argument to the target method', () => {
    new Person().fullName().should.equal('Knight John Snow');
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
