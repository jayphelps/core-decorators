export function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }
  
  const keys = ['value', 'get', 'set'];
  
  for (let i = 0, l = keys.length; i < l; i++) {
    if (desc.hasOwnProperty(keys[i])) {
      return true;
    }
  }
  
  return false;
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
}

const { defineProperty } = Object;

export function metaFor(obj) {
  if (obj.hasOwnProperty('__core_decorators__') === false) {
    defineProperty(obj, '__core_decorators__', {
      // Defaults: NOT enumerable, configurable, or writable
      value: new Meta()
    });
  }

  return obj.__core_decorators__;
}
