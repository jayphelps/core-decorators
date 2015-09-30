import { decorate as _decorate, createDefaultSetter } from './private/utils';

function handleDescriptor(target, key, { value: fn }, [decorator, ...args]) {
  return {
    configurable: true,
    enumerable: false,
    value: decorator(fn, ...args)
  };
}

export default function decorate(...args) {
  return _decorate(handleDescriptor, args);
}
