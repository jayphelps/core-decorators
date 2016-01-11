import { decorate } from './private/utils';

const CONSOLE_NATIVE = console;

let labels = {};
const CONSOLE_TIME = console.time ? console.time.bind(console) : function(label) {
  labels[label] = new Date();
};
const CONSOLE_TIMEEND = console.timeEnd ? console.timeEnd.bind(console) : function(label) {
  let timeNow = new Date();
  let timeTaken = timeNow - labels[label];
  console.log(`${label}: ${timeTaken}ms`);
};

let count = 0;

function handleDescriptor(target, key, descriptor, [prefix = null, konsole = null]) {
  let className = target.constructor.name;
  let fn = descriptor.value;
  const CONSOLE = konsole || CONSOLE_NATIVE;

  if ( prefix === null ) {
    prefix = `${className}.${key}`;
  }

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@instrument can only be used on functions, not: ${fn}`);
  }

  return {
    ...descriptor,
    value() {
      let time = CONSOLE.time || CONSOLE_TIME;
      let timeEnd = CONSOLE.timeEnd || CONSOLE_TIMEEND;
      let label = `${prefix}-${count}`;
      count++;
      time(label);
      let result = fn.apply(this, arguments);
      timeEnd(label);
      return result;
    }
  }
}

export default function instrument(...args) {
  return decorate(handleDescriptor, args);
}
