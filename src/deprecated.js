import { decorate } from './private/utils';

const DEFAULT_MSG = 'This function will be removed in future versions.';

function handleDescriptor(target, key, descriptor, [msg = DEFAULT_MSG, options = {}]) {
  if (typeof descriptor.value !== 'function') {
    throw new SyntaxError('Only functions can be @deprecated');
  }
  
  const methodSignature = `${target.constructor.name}#${key}`;
  
  if (options.url) {
    msg += `\n\n    See ${options.url} for more details.\n\n`;
  }
      
  return {
    ...descriptor,
    value: function deprecationWrapper() {
      console.warn(`DEPRECATION ${methodSignature}: ${msg}`);
      return descriptor.value.apply(this, arguments);
    }
  };
}

export default function deprecated() {
  return decorate(handleDescriptor, arguments);
}
