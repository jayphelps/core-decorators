import { decorate, metaFor } from './private/utils';

const DEFAULT_TIMEOUT = 300;

function handleDescriptor(target, key, descriptor, [wait = DEFAULT_TIMEOUT, leading = true, trailing = true]) {
  const callback = descriptor.value;

  if (typeof callback !== 'function') {
    throw new SyntaxError('Only functions can be throttled');
  }

  return {
    ...descriptor,
    value() {
      const { throttleTimeoutIds, throttlePreviouStimestamps } = metaFor(this);
      const timeout = throttleTimeoutIds[key];
      // last execute timestamp
      let previous = throttlePreviouStimestamps[key] || 0;
      const now = Date.now();
      const args = arguments;

      // if first be called and disable the execution on the leading edge
      // set last execute timestamp to now
      if (!previous && leading === false) {
        previous = now;
      }

      const remaining = wait - (now - previous);

      if (remaining <= 0) {
        clearTimeout(timeout);
        delete throttleTimeoutIds[key];
        throttlePreviouStimestamps[key] = now;
        callback.apply(this, args);
      } else if (!timeout && trailing !== false) {
        throttleTimeoutIds[key] = setTimeout(() => {
          throttlePreviouStimestamps[key] = leading === false ? 0 : Date.now();
          delete throttleTimeoutIds[key];
          callback.apply(this, args);
        }, remaining);
      }
    }
  };
}

export default function throttle(...args) {
  return decorate(handleDescriptor, args);
}
