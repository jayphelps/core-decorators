import { decorate, metaFor } from './private/utils';

const DEFAULT_TIMEOUT = 300;

function handleDescriptor(target, key, descriptor, [wait = DEFAULT_TIMEOUT, options = {}]) {
  const callback = descriptor.value;

  if (typeof callback !== 'function') {
    throw new SyntaxError('Only functions can be throttled');
  }

  if (options.leading !== false) {
    options.leading = true
  }

  if(options.trailing !== false) {
    options.trailing = true
  }

  return {
    ...descriptor,
    value() {
      const { throttleTimeoutIds, throttlePreviousTimestamps } = metaFor(this);
      const timeout = throttleTimeoutIds[key];
      // last execute timestamp
      let previous = throttlePreviousTimestamps[key] || 0;
      const now = Date.now();
      const args = arguments;

      // if first be called and disable the execution on the leading edge
      // set last execute timestamp to now
      if (!previous && options.leading === false) {
        previous = now;
      }

      const remaining = wait - (now - previous);

      if (remaining <= 0) {
        clearTimeout(timeout);
        delete throttleTimeoutIds[key];
        throttlePreviousTimestamps[key] = now;
        callback.apply(this, args);
      } else if (!timeout && options.trailing !== false) {
        throttleTimeoutIds[key] = setTimeout(() => {
          throttlePreviousTimestamps[key] = options.leading === false ? 0 : Date.now();
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
