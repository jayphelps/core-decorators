import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

export default function enumerable(...args) {
  return decorate(handleDescriptor, args);
}
