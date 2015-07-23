import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  descriptor.configurable = false;
  return descriptor;
}

export default function nonconfigurable(...args) {
  return decorate(handleDescriptor, args);
}
