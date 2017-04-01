import {decorate} from './private/utils';

function handleDescriptor(target, key, descriptor) {
  const fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@once can only be used on functions, not: ${fn}`);
  }

  let returnValue;
  let hasRun = false;
  const value = () => {
    if (!hasRun) {
      returnValue = fn.apply(this, arguments);
      hasRun = true;
    }

    return returnValue;
  };

  value.reset = () => {
    returnValue = undefined;
    hasRun = false;
  };

  return {...descriptor, value};
}

export default function once(...args) {
  return decorate(handleDescriptor, args);
}
