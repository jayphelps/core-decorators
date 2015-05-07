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

  let boundFn = null;
  
  return {
    configurable: true,
    get() {
      if (boundFn === null) {
        boundFn = bind(fn, this);  
      }

      return boundFn;
    },
    set(newValue) {
      boundFn = newValue;
    }
  };
}

export default function autobind() {
  return decorate(handleDescriptor, arguments);
}
