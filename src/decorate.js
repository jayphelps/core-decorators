import { decorate as _decorate, createDefaultSetter } from './private/utils';

function handleDescriptor(target, key, descriptor, [decorator, ...args]) {
  const { value: fn, configurable, enumerable, writable } = descriptor;

  return {
    configurable,
    enumerable,
    get() {
      const value = decorator(fn, ...args);

      Object.defineProperty(this, key, {
        configurable,
        enumerable,
        writable,
        value
      });

      return value;
    },
    set: createDefaultSetter()
  };
}

export default function decorate(...args) {
  return _decorate(handleDescriptor, args);
}
