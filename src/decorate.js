import { decorate as _decorate, createDefaultSetter } from './private/utils';
const { defineProperty } = Object;

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

      if (isGetter) {
        return value;
      } else {
        const desc = {
          configurable,
          enumerable
        };

        desc.value = value;
        desc.writable = writable;

        defineProperty(this, key, desc);

        return value;
      }
    },
    set: isGetter ? originalSet : createDefaultSetter()
  };
}

export default function decorate(...args) {
  return _decorate(handleDescriptor, args);
}
