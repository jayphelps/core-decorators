import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

function nonenumerable(
  target: object, 
  key: string | symbol, 
  desc?: TypedPropertyDescriptor<any>) 
: void
{
  return decorate(handleDescriptor, [target, key, desc]);
}

export default nonenumerable;
