import { decorate, metaFor } from './private/utils';
import {defaultConsole} from './defaultConsole';


function handleDescriptor(target, key, descriptor, [prefix  = null, onceThrottleOrFunction = false, console = defaultConsole] ) {
  
  if (!profile.__enabled) {
    if (!profile.__warned) {
      console.warn('console.profile is not supported. All @profile decorators are disabled.');
      profile.__warned = true;
    }
    return descriptor;
  }

  const fn = descriptor.value;

  if (prefix === null) {
    prefix = `${target.constructor.name}.${key}`;
  }

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@profile can only be used on functions, not: ${fn}`);
  }

  return {
    ...descriptor,
    value() {
      const now = Date.now();
      const meta = metaFor(this);
      if (
        (onceThrottleOrFunction === true && !meta.profileLastRan) ||
        (onceThrottleOrFunction === false) ||
        (typeof onceThrottleOrFunction === 'number' && (now - meta.profileLastRan) > onceThrottleOrFunction) ||
        (typeof onceThrottleOrFunction === 'function' && (onceThrottleOrFunction as Function).apply(this, arguments))
      ) {
        console.profile(prefix);
        meta.profileLastRan = now;
      }

      try {
        return fn.apply(this, arguments);
      } finally {
        console.profileEnd(prefix);
      }
    }
  }
}

function profile(...args) {
  return decorate(handleDescriptor, args);
}

// Only Chrome, Firefox, and Edge support profile.
// Exposing properties for testing.

namespace profile {
  export var __enabled = !!console.profile;
  export var __warned = false;
}

export { profile };
export default profile;