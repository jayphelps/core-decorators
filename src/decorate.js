import { decorate as _decorate, createDefaultSetter } from './private/utils';

function handleDescriptor(target, key, descriptor, [decorator, ...args]) {
  const { configurable, enumerable, writable } = descriptor;
  const originalGet = descriptor.get;
  const originalSet = descriptor.set;
  const originalValue = descriptor.value;
  const isGetter = !!originalGet;

  return {
    configurable,
    enumerable,
    get() {
      const fn = isGetter ? originalGet.call(this) : originalValue;
      const value = decorator.call(this, fn, ...args);
      const desc = {
        configurable,
        enumerable,
        value,
        writable
      };

      if (isGetter) {
        desc.writable = true;
      }

      Object.defineProperty(this, key, desc);

      return value;
    },
    set: isGetter ? originalSet : createDefaultSetter()
  };
}

export default function decorate(...args) {
  return _decorate(handleDescriptor, args);
}
