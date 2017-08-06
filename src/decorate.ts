import { decorate as _decorate, createDefaultSetter } from './private/utils';
const { defineProperty } = Object;

function handleDescriptor(
    target: object, 
    key: string | symbol, 
    descriptor: TypedPropertyDescriptor<any>,
    [decorator, ...args]) : TypedPropertyDescriptor<any> {
  const { configurable, enumerable, writable } = descriptor;
  const originalGet = descriptor.get;
  const originalSet = descriptor.set;
  const originalValue = descriptor.value;
  const isGetter = !!originalGet;
  
  return {
    configurable,
    enumerable: typeof originalValue == 'function' ? false : enumerable,
    get() {
      const fn = isGetter ? originalGet.call(this) : originalValue;
      const value = decorator.call(this, fn, ...args);

      if (isGetter) {
        return value;
      } else {
        const desc: PropertyDescriptor  = {
          configurable,
          enumerable
        };

        desc.value = value;
        desc.writable = writable;

        defineProperty(this, key, desc);

        return value;
      }
    },
    set: isGetter ? originalSet : createDefaultSetter(key)
  };
}

export default function decorate(...args) {
  return _decorate(handleDescriptor, args);
}
