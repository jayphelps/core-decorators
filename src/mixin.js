import { getOwnPropertyDescriptors } from './private/utils';

const { defineProperty } = Object;

function handleClass(target, mixins) {
  if (!mixins.length) {
    throw new SyntaxError(`@mixin() class ${target.name} requires at least one mixin as an argument`);
  }

  for (let i = 0, l = mixins.length; i < l; i++) {
    const descs = getOwnPropertyDescriptors(mixins[i]);

    for (const key in descs) {
      if (!(key in target.prototype)) {
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
