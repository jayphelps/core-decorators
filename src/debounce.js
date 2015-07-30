import { decorate } from './private/utils';

const DEFAULT_TIMEOUT = 300;

function handleDescriptor(target, key, descriptor, [wait = DEFAULT_TIMEOUT, immediate = false]) {

  if (typeof descriptor.value !== 'function') {
    throw new SyntaxError('Only functions can be debounced');
  }

  return {
    ...descriptor,
    value: function() {

      var timeout;

      return function () {

          var func = descriptor.value;
          var args = arguments;
          var callNow = immediate && !timeout;

          clearTimeout(timeout);

          timeout = setTimeout(() => {
            timeout = null;
            if (!immediate) func.apply(this, args);
          }, wait);

          if (callNow) func.apply(this, args);
      };
    }()
  };
}

export default function debounce(...args) {
  return decorate(handleDescriptor, args);
}
