import { decorate } from './private/utils';

const labels = {};

// Exported for mocking in tests
export const defaultConsole = {
  time: console.time ? console.time.bind(console) : label => {
    labels[label] = new Date();
  },
  timeEnd: console.timeEnd ? console.timeEnd.bind(console) : label => {
    const timeNow = new Date();
    const timeTaken = timeNow - labels[label];
    delete labels[label];
    console.log(`${label}: ${timeTaken}ms`);
  }
};

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
