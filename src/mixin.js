import { getOwnPropertyDescriptors, getOwnKeys } from './private/utils';

const { defineProperty, getPrototypeOf } = Object;

function buggySymbol(symbol) {
  return Object.prototype.toString.call(symbol) === '[object Symbol]' && typeof(symbol) === 'object';
}

function hasProperty(prop, obj) {
  // We have to traverse manually prototypes' chain for polyfilled ES6 Symbols
  // like "in" operator does.
  // I.e.: Babel 5 Symbol polyfill stores every created symbol in Object.prototype.
  // That's why we cannot use construction like "prop in obj" to check, if needed
  // prop actually exists in given object/prototypes' chain.
  if (buggySymbol(prop)) {
    do {
      if (obj === Object.prototype) {
        // Polyfill assigns undefined as value for stored symbol key.
        // We can assume in this special case if there is nothing assigned it doesn't exist.
        return typeof(obj[prop]) !== 'undefined';
      }
      if (obj.hasOwnProperty(prop)) {
        return true;
      }
    } while (obj = getPrototypeOf(obj));
    return false;
  } else {
    return prop in obj;
  }
}

function handleClass(target, mixins) {
  if (!mixins.length) {
    throw new SyntaxError(`@mixin() class ${target.name} requires at least one mixin as an argument`);
  }

  for (let i = 0, l = mixins.length; i < l; i++) {
    const descs = getOwnPropertyDescriptors(mixins[i]);
    const keys = getOwnKeys(descs);

    for (let j = 0, k = keys.length; j < k; j++) {
      const key = keys[j];

      if (!(hasProperty(key, target.prototype))) {
        defineProperty(target.prototype, key, descs[key]);
      }
    }
  }
}

export default function mixin(...mixins) {
  if (typeof mixins[0] === 'function') {
    return handleClass(mixins[0], []);
  } else {
    return target => {
      return handleClass(target, mixins);
    };
  }
}
