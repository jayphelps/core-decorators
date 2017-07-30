import { decorate } from './private/utils';
import {defaultConsole} from './defaultConsole';

let count = 0;

function handleDescriptor(target, key, descriptor, [prefix = null, console = defaultConsole]) {
  const fn = descriptor.value;

  if (prefix === null) {
    prefix = `${target.constructor.name}.${key}`;
  }

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@time can only be used on functions, not: ${fn}`);
  }

  return {
    ...descriptor,
    value() {
      const label = `${prefix}-${count}`;
      count++;
      console.time(label);

      try {
        return fn.apply(this, arguments);
      } finally {
        console.timeEnd(label);
      }
    }
  }
}

export default function time(...args) {
  return decorate(handleDescriptor, args);
}
