import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  if (typeof descriptor.value === 'function') {
    return handleMethod(target, key, descriptor);
  }
  else if (typeof descriptor.initializer === 'function') {
    return handleInitializedProperty(target, key, descriptor);
  }
  else {
    return handleProperty(target, key, descriptor);
  }
}

function handleInitializedProperty(target, key, descriptor) {
  // silently ignore initialized instance property
  if (typeof target == 'object' && target.constructor) {
    return descriptor;
  }

  const superDesc = findSuperDesc(target, key);

  return {
    ...superDesc,
    initializer: descriptor.initializer || superDesc.initializer
  };
}

function handleMethod(target, key, descriptor) {
  const superDesc = findSuperDesc(target, key);

  return {
    ...superDesc,
    value: descriptor.value
  };
}

function handleProperty(target, key, descriptor) {
  const superDesc = findSuperDesc(target, key);

  return {
    ...superDesc,
    get: descriptor.get || superDesc.get,
    set: descriptor.set || superDesc.set
  };
}

function findSuperDesc(target, key) {
  let result;
  if (typeof target === 'function') {
    result = findSuperDescFromConstructorOrPrototype(target, key, false);
  }
  else {
    result = findSuperDescFromConstructorOrPrototype(target, key, true);
  }

  if (!result) {
    throw new Error(`no super class realizes the specified property/method "${key}"`);
  }

  return result;
}

function findSuperDescFromConstructorOrPrototype(target, key, isPrototype) {
  let base = Object.getPrototypeOf(isPrototype ? target.constructor : target);
  // we must stop once we reach built-in objects
  while (base.prototype)
  {
    const desc = Object.getOwnPropertyDescriptor(isPrototype ? base.prototype : base, key);
    if (desc) {
      return desc;
    }
    base = Object.getPrototypeOf(base);
  }

  return undefined;
}

export default function extendDescriptor(...args) {
  return decorate(handleDescriptor, args);
}
