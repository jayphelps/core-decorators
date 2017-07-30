import { decorate } from './private/utils';
const { getPrototypeOf, getOwnPropertyDescriptor } = Object;

function handleDescriptor(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>):  TypedPropertyDescriptor<any> {
  const superKlass = getPrototypeOf(target);
  const superDesc = getOwnPropertyDescriptor(superKlass, key);

  

  return {
    ...superDesc,
    value: descriptor.value,
    initializer: (descriptor as any).initializer,
    get: descriptor.get || (superDesc ? superDesc.get : undefined),
    set: descriptor.set || (superDesc ? superDesc.set : undefined)
  } as TypedPropertyDescriptor<any>;
}

function extendDescriptor(target: object, key: string | symbol, desc?: TypedPropertyDescriptor<any>) : any;
function extendDescriptor(...args)  {
  return decorate(handleDescriptor, args);
}

export default extendDescriptor