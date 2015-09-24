const { defineProperty, getOwnPropertyDescriptor,
        getOwnPropertyNames, getOwnPropertySymbols } = Object;
        
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

export function metaFor(obj) {
  if (obj.hasOwnProperty('__core_decorators__') === false) {
    defineProperty(obj, '__core_decorators__', {
      // Defaults: NOT enumerable, configurable, or writable
      value: new Meta()
    });
  }

  return obj.__core_decorators__;
}

const getOwnKeys = getOwnPropertySymbols
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
