import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor, [fn]) {   
  const value = descriptor.value;
  
  if (typeof value !== 'function') {
    throw new SyntaxError(`@before can only be used on functions, not: ${value}`);
  }
  
  if (typeof fn !== 'function' && (!fn.then && typeof fn.then !== 'function')) {
    throw new SyntaxError(`@before need a function or a promise in parameter, not: ${fn}`);
  }

  const isPromised = fn.then && typeof fn.then === 'function';

  return {
    ...descriptor,
    value: () => {      
      try {        
        if (isPromised) {          
          fn.then(function(val) {                  
            return value.apply(this, arguments); 
          });
        }
        else {          
          return fn.apply(this, arguments);
        }
      } finally {
        if (!isPromised)
          return value.apply(this, arguments);
      }
    }
  }  
}

export default function before(...args) {
  return decorate(handleDescriptor, args);
}
