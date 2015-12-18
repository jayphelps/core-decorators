const { defineProperty, getOwnPropertyDescriptor,
        getOwnPropertyNames, getOwnPropertySymbols } = Object;

export function isDescriptor(desc) {
  const keys = ['value', 'get', 'set'];

  return desc
    && desc.hasOwnProperty
    && keys.some(key => desc.hasOwnProperty(key));
}

export function decorate(handleDescriptor, entryArgs) {
  if (isDescriptor(entryArgs[entryArgs.length - 1])) {
    return handleDescriptor(...entryArgs, []);
  } else {
    return function () {
      return handleDescriptor(...arguments, entryArgs);
    };
  }
}

class Meta {
  debounceTimeoutIds = {};
  throttleTimeoutIds = {};
  throttlePreviouStimestamps = {};
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

const getOwnKeys = getOwnPropertySymbols
    ? function (object) {
        return getOwnPropertyNames(object)
          .concat(getOwnPropertySymbols(object));
      }
    : getOwnPropertyNames;


export function getOwnPropertyDescriptors(obj) {
  return getOwnKeys(obj).reduce((descs, key) => {
    descs[key] = getOwnPropertyDescriptor(obj, key);
    return descs;
  }, {});
}

export function createDefaultSetter(key) {
  return function set(newValue) {
    Object.defineProperty(this, key, {
      configurable: true,
      writable: true,
      // IS enumerable when reassigned by the outside word
      enumerable: true,
      value: newValue
    });

    return newValue;
  };
}
