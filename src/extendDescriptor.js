import { decorate } from './private/utils';
const { getPrototypeOf, getOwnPropertyDescriptor } = Object;

function handleDescriptor(target, key, descriptor) {
  const superKlass = getPrototypeOf(target);
  const superDesc = getOwnPropertyDescriptor(superKlass, key);

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
