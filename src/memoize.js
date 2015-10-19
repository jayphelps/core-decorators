import { decorate } from './private/utils';

function toObject(cache, value) {
  if (value === Object(value)) {
    return value;  
  }
  return cache[value] || (cache[value] = {});
}

function applyAndCache(context, fn, args, cache, signature) {
  const ret = fn.apply(context, args);
  cache[signature] = ret;
  return ret;
}

function metaForDescriptor(descriptor) {
  let fn, wrapKey;

  // This is ugly code, but way faster than other
  // ways I tried that *looked* pretty
  
  if (descriptor.value) {
    fn = descriptor.value;
    wrapKey = 'value';
  } else if (descriptor.get) {
    fn = descriptor.get;
    wrapKey = 'get';
  } else if (descriptor.set) {
    fn = descriptor.set;
    wrapKey = 'set';
  }

  return { fn, wrapKey };
}

function handleDescriptor(target, key, descriptor) {
  console.warn('DEPRECATION: @memoize is deprecated and will be removed shortly. Use @decorate with lodash\'s memoize helper.\n\n  https://github.com/jayphelps/core-decorators.js#decorate');

  const { fn, wrapKey } = metaForDescriptor(descriptor);
  const argumentCache = new WeakMap();
  const signatureCache = Object.create(null);
  const primativeRefCache = Object.create(null);
  let argumentIdCounter = 0;
  
  return {
    ...descriptor,
    [wrapKey]: function memoizeWrapper(...args) {
      let signature = '0';
      
      for (let i = 0, l = args.length; i < l; i++) {
        let arg = args[i];
        let argRef = toObject(primativeRefCache, arg);
        let argKey = argumentCache.get(argRef);
        
        if (argKey === undefined) {
          argKey = ++argumentIdCounter;
          argumentCache.set(argRef, argKey);
        }
        
        signature += argKey;
      }
      
      return signatureCache[signature]
        || applyAndCache(this, fn, arguments, signatureCache, signature);
    }
  };
}

export default function memoize(...args) {
  return decorate(handleDescriptor, args);
}