import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor, [propertyName = 'props']) {
  const originalFunction = descriptor.value;

  if (typeof originalFunction !== 'function') {
    throw new SyntaxError(`@injectProps can only be used on functions, not: ${originalFunction}`);
  }

  return {
    ...descriptor,
    value: function propsInjectorWrapper(...args) {
      args.unshift(this[propertyName]);

      return originalFunction.apply(this, args);
    }
  };
}

export default function injectProps(...args) {
  return decorate(handleDescriptor, args);
}
