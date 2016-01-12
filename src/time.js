import { decorate } from './private/utils';

const CONSOLE_NATIVE = console;

const labels = {};
const CONSOLE_TIME = console.time ? console.time.bind(console) : label => {
  labels[label] = new Date();
};
const CONSOLE_TIMEEND = console.timeEnd ? console.timeEnd.bind(console) : label => {
  const timeNow = new Date();
  const timeTaken = timeNow - labels[label];
  console.log(`${label}: ${timeTaken}ms`);
};

let count = 0;

function handleDescriptor(target, key, descriptor, [prefix = null, konsole = null]) {
  const fn = descriptor.value;
  const CONSOLE = konsole || CONSOLE_NATIVE;

  if (prefix === null) {
    prefix = `${target.constructor.name}.${key}`;
  }

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@time can only be used on functions, not: ${fn}`);
  }

  return {
    ...descriptor,
    value() {
      const time = CONSOLE.time || CONSOLE_TIME;
      const timeEnd = CONSOLE.timeEnd || CONSOLE_TIMEEND;
      const label = `${prefix}-${count}`;
      count++;
      time(label);

      try {
        return fn.apply(this, arguments);
      } finally {
        timeEnd(label);
      }
    }
  }
}

export default function time(...args) {
  return decorate(handleDescriptor, args);
}
