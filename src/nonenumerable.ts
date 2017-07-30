import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

function nonenumerable(target: object, key: string | symbol, desc?: TypedPropertyDescriptor<any>): any;
function nonenumerable(...args) {
  return decorate(handleDescriptor, args);
}

export default nonenumerable;