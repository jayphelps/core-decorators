import { decorate, createDefaultSetter } from './private/utils';
const { defineProperty } = Object;

function handleDescriptor(target, key, descriptor, [fnInitializerOrNoWarn, ...arg]) {
  let { configurable, enumerable, initializer, value } = descriptor;

  const noInitializerSupport = (initializer === undefined);

  // Process Decorator Argument
  let fnInitializer, noWarn;
  if ((typeof fnInitializerOrNoWarn === 'object') && (!!fnInitializerOrNoWarn.noWarn))
    noWarn = true;
  else
    fnInitializer = fnInitializerOrNoWarn;

  initializer = fnInitializer ? fnInitializer : initializer;

  const desc = {
    configurable,
    enumerable,

    get() {
      // This happens if someone accesses the property directly on the prototype
      if (this === target) { return; }

      const ret = initializer ? initializer.call(this, ...arg) : value;

      defineProperty(this, key, {
        configurable,
        enumerable,
        writable: true,
        value: ret
      });

      return ret;
    },

    set: createDefaultSetter(key)
  };

  // Compensate for the following typescript issue: (as of typescript v3.5.1)
  //  - TypeScript compiler does not properly handle property 'initalizer', therefore it renders myProp = myInitializer()
  //    as this.myProp = myInitializer() in the class constructor
  //
  //  + Workaround: pass initializer as decorator parameter - ie. @lazyInitialize(myInitializer) myVar:myType
  if (noInitializerSupport) {
    if (!fnInitializer && !noWarn) {
      console.warn('Looks like your compiler does not support initializers!\n To ensure lazyInitialize functions properly - Instead of @lazyInitialze myProp = myInitializer() use: @lazyInitialize(myInitializer) myProp;');
    }

    // Allow compiler to set initial value
    desc.set = function(val) {
      Object.defineProperty(target, key, {...desc, set: createDefaultSetter(key) });
      value = val;
      return val;
    };

    // If no value assigned, object needs to be initially created (supports fnInitializer)
    if (fnInitializer && !value) Object.defineProperty(target, key, {...desc, configurable: true, enumerable: true});
  }

  return desc;
}

export default function lazyInitialize(...args) {
  return decorate(handleDescriptor, args);
}

