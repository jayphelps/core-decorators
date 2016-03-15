import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  const superKlass = Object.getPrototypeOf(target);
  const superDesc = Object.getOwnPropertyDescriptor(superKlass, key);

  return {
    ...superDesc,
    value: descriptor.value,
    initializer: descriptor.initializer,
    get: descriptor.get || superDesc.get,
    set: descriptor.set || superDesc.set
  };
}

export default function extendDescriptor(...args) {
  return decorate(handleDescriptor, args);
}
