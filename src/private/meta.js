import lazyInitialize from "../lazy-initialize";
const { defineProperty } = Object;

class Meta {
  @lazyInitialize({noWarn: true})
  debounceTimeoutIds = {};

  @lazyInitialize({noWarn: true})
  throttleTimeoutIds = {};

  @lazyInitialize({noWarn: true})
  throttlePreviousTimestamps = {};

  @lazyInitialize({noWarn: true})
  throttleTrailingArgs = null;

  @lazyInitialize({noWarn: true})
  profileLastRan = null;
}

const META_KEY = (typeof Symbol === 'function')
  ? Symbol('__core_decorators__')
  : '__core_decorators__';

export function metaFor(obj) {
  if (obj.hasOwnProperty(META_KEY) === false) {
    defineProperty(obj, META_KEY, {
      // Defaults: NOT enumerable, configurable, or writable
      value: new Meta()
    });
  }

  return obj[META_KEY];
}
