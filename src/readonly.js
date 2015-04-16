import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

export default function readonly() {
  return decorate(handleDescriptor, arguments);
}
