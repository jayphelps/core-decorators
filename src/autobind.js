import { decorate, createDefaultSetter, getOwnPropertyDescriptors } from './private/utils';
const { defineProperty } = Object;

function bind(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else {
    return function __autobind__() {
      return fn.apply(context, arguments);
    };
  }
}

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

function autobindClass(target) {
  const descs = getOwnPropertyDescriptors(target.prototype);

  for (const key in descs) {
    const desc = descs[key];
    if (typeof desc.value !== 'function' || key === 'constructor') {
      continue;
    }

    defineProperty(target.prototype, key, autobindMethod(target, key, desc));
  }
}

function autobindMethod(target, key, { value: fn }) {
  if (typeof fn !== 'function') {
    throw new SyntaxError(`@autobind can only be used on functions, not: ${fn}`);
  }

  const { constructor } = target;

  return {
    configurable: true,
    enumerable: false,

    get() {
      // This happens if someone accesses the
      // property directly on the prototype
      if (this === target) {
        return fn;
      }

      // This is a confusing case where you have an autobound method calling
      // super.sameMethod() which is also autobound and so on.
      if (this.constructor !== constructor && this.constructor.prototype.hasOwnProperty(key)) {
        return getBoundSuper(this, fn);
      }

      const boundFn = bind(fn, this);

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

function handle(args) {
  if (args.length === 1) {
    return autobindClass(...args);
  } else {
    return autobindMethod(...args);
  }
}

export default function autobind(...args) {
  if (args.length === 0) {
    return function () {
      return handle(arguments);
    };
  } else {
    return handle(args);
  }
}
