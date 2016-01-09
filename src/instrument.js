import { decorate } from './private/utils';

const CONSOLE_NATIVE = console;

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
      let timeStarted;
      let log = CONSOLE.log ? CONSOLE.log.bind(CONSOLE) : CONSOLE_NATIVE.log.bind(CONSOLE_NATIVE);
      let time = CONSOLE.time ? CONSOLE.time.bind(CONSOLE) : function() {
        timeStarted = new Date();
      };
      let timeEnd = CONSOLE.timeEnd ? CONSOLE.timeEnd.bind(CONSOLE) : function() {
        let timeEnded = new Date();
        let timeTaken = timeEnded - timeStarted;
        log(`${label}: ${timeTaken}ms`);
      };
      let label = `${prefix}-${count}`;
      count++;
      time(label);
      fn.apply(this, arguments);
      timeEnd(label);
    }
  }
}

export default function instrument(...args) {
  return decorate(handleDescriptor, args);
}
