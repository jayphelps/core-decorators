const DEFAULT_MSG = 'This function will be removed in future versions.';

function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }
  
  const keys = ['value', 'get', 'set'];
  
  for (const key of keys) {
    if (desc.hasOwnProperty(key)) {
      return true;
    }
  }
  
  return false;
}

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
      return descriptor.value(...arguments);
    }
  };
}

export default function deprecated(...entryArgs) {
  if (isDescriptor(entryArgs[entryArgs.length - 1])) {
    return handleDescriptor(...entryArgs, []);
  } else {
    return function () {
      return handleDescriptor(...arguments, entryArgs);
    };
  }
}
