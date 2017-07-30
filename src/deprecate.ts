import { decorate, warn } from './private/utils';

const DEFAULT_MSG = 'This function will be removed in future versions.';

function handleDescriptor(target:Object, key: string|symbol, 
    descriptor: TypedPropertyDescriptor<any>,
    [msg = DEFAULT_MSG, options = {url: undefined}]) {
  if (typeof descriptor.value !== 'function') {
    throw new SyntaxError('Only functions can be marked as deprecated');
  }
  
  const methodSignature = `${target.constructor.name}#${key}`;
  
  if (options.url) {
    msg += `\n\n    See ${options.url} for more details.\n\n`;
  }
      
  return {
    ...descriptor,
    value: function deprecationWrapper() {
      warn(`DEPRECATION ${methodSignature}: ${msg}`);
      return descriptor.value.apply(this, arguments);
    }
  };
}

function deprecate(...args) {
  return decorate(handleDescriptor, args);
}

export {deprecate, deprecate as deprecated} ;

export default deprecate;
