const { getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols } = Object;

const DEFAULT_DESCRIPTOR = {
  writable: true,
  enumerable: true,
  configurable: true
};

export function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  const keys = ['value', 'initializer', 'get', 'set'];

  for (let i = 0, l = keys.length; i < l; i++) {
    if (desc.hasOwnProperty(keys[i])) {
      return true;
    }
  }

  return false;
}

/** Check if decorator call is a factory */
export const isDecoratorFactory = (arg) => (arg.length !== 3) || (typeof arg[0] !== 'object') || ((typeof arg[1] !== 'string') && (typeof arg[1] !== 'symbol'));

export function decorate(handleDescriptor, entryArgs) {
  function handle (handleDescriptor, target, key, descriptor, params = []) {
    // Attempt to get new descriptor information from provided handleDescriptor callback
    const provided_desc = handleDescriptor(target, key, (isDescriptor(descriptor) ? descriptor : DEFAULT_DESCRIPTOR), params);
    descriptor = isDescriptor(provided_desc) ? provided_desc : DEFAULT_DESCRIPTOR;

    // Compensate for the following typescript issues/differences: (as of typescript v3.5.1)
    //  - For non-method Class properties, some descriptor properties (like enumerable) are overwritten at instance creation
    //  - Also, setting initial writable = false prevents constructor and ESnext class fields from assigning initial value.
    if (!(target.hasOwnProperty(key))) {
      // Copy provided descriptor
      let final_descriptor = Object.assign({}, descriptor);
      // Compensate for typescript compiler read only issue
      delete descriptor['writable'];

      // Setup initial descriptor
      descriptor = {
        get: function () {
          return undefined;
        },
        set: function (val) {
          // Set final property
          Object.defineProperty(this, key, {value: val, ...final_descriptor})
        },
        ...descriptor
      };
    }

    return descriptor;
  }

  // Wrap if factory
  if (isDecoratorFactory(entryArgs)) {
    return function () {
      return handle(handleDescriptor, ...Array.prototype.slice.call(arguments), entryArgs);
    }
  } else {
    return handle(handleDescriptor, ...entryArgs, []);
  }
}

export const getOwnKeys = getOwnPropertySymbols
    ? function (object) {
        return getOwnPropertyNames(object)
          .concat(getOwnPropertySymbols(object));
      }
    : getOwnPropertyNames;


export function getOwnPropertyDescriptors(obj) {
  const descs = {};

  getOwnKeys(obj).forEach(
    key => (descs[key] = getOwnPropertyDescriptor(obj, key))
  );

  return descs;
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

export function bind(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else {
    return function __autobind__() {
      return fn.apply(context, arguments);
    };
  }
}

export const warn = (() => {
  if (typeof console !== 'object' || !console || typeof console.warn !== 'function') {
    return () => {};
  } else {
    return bind(console.warn, console);
  }
})();

const seenDeprecations = {};
export function internalDeprecation(msg) {
  if (seenDeprecations[msg] !== true) {
    seenDeprecations[msg] = true;
    warn('DEPRECATION: ' + msg);
  }
}
