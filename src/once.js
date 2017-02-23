import {decorate} from './private/utils';

function handleDescriptor(target, key, descriptor) {
  const fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@once can only be used on functions, not: ${fn}`);
  }

  let returnedValue;

  return {
    ...descriptor,
    value() {
      if (!returnedValue) {
        returnedValue = fn.apply(this, arguments);
      }

      return returnedValue;
    }
  }
}

export default function once(...args) {
  return decorate(handleDescriptor, args);
}
