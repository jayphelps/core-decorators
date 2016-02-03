import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor, [fn]) {   
  const value = descriptor.value;
  
  if (typeof value !== 'function') {
    throw new SyntaxError(`@before can only be used on functions, not: ${value}`);
  }
  
  if (typeof fn !== 'function') {
    throw new SyntaxError(`@before need a function in parameter, not: ${fn}`);
  }

  return {
    ...descriptor,
    value: () => {
      try {
        return fn.apply(this, arguments);
      } finally {
        return value.apply(this, arguments);
      }
    }
  }  
}

export default function before(...args) {
  return decorate(handleDescriptor, args);
}
