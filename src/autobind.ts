import { decorate, createDefaultSetter, getOwnPropertyDescriptors, ownKeys, bind } from './private/utils';
const { defineProperty, getPrototypeOf } = Object;

let mapStore;

function getBoundSuper(obj, fn) {
  if (typeof WeakMap === 'undefined') {
    throw new Error(
      `Using @autobind on ${fn.name}() requires WeakMap support due to its use of super.${fn.name}()
      See https://github.com/jayphelps/core-decorators.js/issues/20`
    );
  }

  if (!mapStore) {
     mapStore = new WeakMap(); 
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new WeakMap());
  }

  const superStore = mapStore.get(obj);

  if (superStore.has(fn) === false) {
    superStore.set(fn, bind(fn, obj));
  }

  return superStore.get(fn);
}

function autobindClass(klass) {
  const descs = getOwnPropertyDescriptors(klass.prototype);
  const keys = ownKeys(descs);

  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    const desc = descs[key];

    if (typeof desc.value !== 'function' || key === 'constructor') {
      continue;
    }

    defineProperty(klass.prototype, key, autobindMethod(klass.prototype, key, desc));
  }
}

function autobindMethod(target: Object, key: PropertyKey, descriptor: TypedPropertyDescriptor<any> )  : TypedPropertyDescriptor<any> {

  if (typeof descriptor.value !== 'function') {
    throw new SyntaxError(`@autobind can only be used on functions, not: ${descriptor.value}`);
  }

  const { constructor } = target;

  return {
    configurable: descriptor.configurable,
    enumerable: false,

    get() {
      // Class.prototype.key lookup
      // Someone accesses the property directly on the prototype on which it is
      // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
      if (this === target) {
        return descriptor.value;
      }

      // Class.prototype.key lookup
      // Someone accesses the property directly on a prototype but it was found
      // up the chain, not defined directly on it
      // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
      if (this.constructor !== constructor && getPrototypeOf(this).constructor === constructor) {
        return descriptor.value;
      }

      // Autobound method calling super.sameMethod() which is also autobound and so on.
      if (this.constructor !== constructor && key in this.constructor.prototype) {
        return getBoundSuper(this, descriptor.value);
      }

      const boundFn = bind(descriptor.value, this);

      defineProperty(this, key, {
        configurable: true,
        writable: true,
        // NOT enumerable when it's a bound method
        enumerable: false,
        value: boundFn
      });

      return boundFn;
    },
    set: createDefaultSetter(key)
  };
}

function handle(...args) {
  if (arguments.length === 1) {
    return autobindClass(arguments[0]);
  } else {
    return autobindMethod(arguments[0], arguments[1], arguments[2]);
  }
}

function autobind(target: Function); // Class decorator
function autobind(target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>; // Method decorator
function autobind(); // Invoked with parens
function autobind(...args) {
  if (arguments.length === 0) {
    return function (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
      return handle(target, key, descriptor);
    };
  }
  return handle(...args);
 }

export { autobind };
export default autobind;
