import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  descriptor.enumerable = true;
  return descriptor;
}

export default function enumerable(...args) {
  return decorate(handleDescriptor, args);
}
