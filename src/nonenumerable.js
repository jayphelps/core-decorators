import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

export default function nonenumerable() {
  return decorate(handleDescriptor, arguments);
}
