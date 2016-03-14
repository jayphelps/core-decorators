import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor, propertyNames) {
  const originalFunction = descriptor.value;

  if (typeof originalFunction !== 'function') {
    throw new SyntaxError(`@injectProps can only be used on functions, not: ${originalFunction}`);
  }

  if (!propertyNames.length) {
    propertyNames = ['props'];
  }

  return {
    ...descriptor,
    value: function propsInjectorWrapper(...args) {
      const properties = propertyNames.map(propertyName => this[propertyName]);
      const newArgs = properties.concat(args);

      return originalFunction.apply(this, newArgs);
    }
  };
}

export default function injectProps(...args) {
  return decorate(handleDescriptor, args);
}
