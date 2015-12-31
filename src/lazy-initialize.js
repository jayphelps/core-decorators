import { decorate, createDefaultSetter } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  const { configurable, enumerable, initializer, value } = descriptor;
  return {
    configurable,
    enumerable,

    get() {
      // This happens if someone accesses the
      // property directly on the prototype
      if (this === target) {
        return;
      }

      const ret = initializer ? initializer.call(this) : value;

      Object.defineProperty(this, key, {
        configurable,
        enumerable,
        writable: true,
        value: ret
      });

      return ret;
    },

    set: createDefaultSetter(key)
  };
}

export default function lazyInitialize(...args) {
  return decorate(handleDescriptor, args);
}
