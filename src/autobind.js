import { decorate } from './private/utils';

function bind(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else {
    return function __autobind__() {
      return fn.apply(context, arguments);
    };
  }
}

function handleDescriptor(target, key, { value: fn }) {
  if (typeof fn !== 'function') {
    throw new SyntaxError(`@autobind can only be used on functions, not: ${fn}`);
  }

  return {
    configurable: true,
    get() {
      return (this[key] = bind(fn, this));
    },
    set(newValue) {
      if (this === target) {
        // New value directly set on the prototype.
        delete this[key];
        this[key] = newValue;
      } else {
        // New value set on a child object.

        // Cannot use assignment because it will call the setter on the
        // prototype.
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: true,
          value: newValue,
          writable: true
        });
      }
    }
  };
}

export default function autobind(...args) {
  return decorate(handleDescriptor, args);
}
