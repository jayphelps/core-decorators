import {decorate} from './private/utils';

function handleDescriptor(target, key, descriptor) {
  const fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@once can only be used on functions, not: ${fn}`);
  }

  let returnedValue;
  let hasRun = false;
  let value = function () {
    if (!hasRun) {
      returnedValue = fn.apply(this, arguments);
      hasRun = true;
    }

    return returnedValue;
  };

  value.reset = function () {
    returnedValue = undefined;
    hasRun = false;
  };
  return {
    ...descriptor, value
  }
}

export default function once(...args) {
  return decorate(handleDescriptor, args);
}
