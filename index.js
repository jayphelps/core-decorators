class SyntaxErrorReporter {
  key: string;
  parent: Function;
  child: Function;

  get parentNotation() {
    return `${this.parent.constructor.name}#${this.key}`;
  }

  get childNotation() {
    return `${this.child.constructor.name}#${this.key}`;
  }

  constructor(propertyKey, parentKlass, childClass) {
    this.key = propertyKey;
    this.parent = parentKlass;
    this.child = childClass;
  }

  error(msg) {
    msg = msg
      .replace('{parent}', this.parentNotation)
      .replace('{child}', this.childNotation);

    throw new SyntaxError(msg);
  }
}

function getDescriptorType(descriptor) {
  if (descriptor.hasOwnProperty('value')) {
    return 'data';
  }

  if (descriptor.hasOwnProperty('get') || descriptor.hasOwnProperty('set')) {
    return 'accessor';
  }

  // If none of them exist, browsers treat it as
  // a data descriptor with a value of `undefined`
  return 'data';
}

function checkDataDescriptors(parent, child, reportor) {
  const parentValueType = typeof parent.value;
  const childValueType = typeof child.value;

  if (parentValueType !== childValueType) {
    reportor.error(`Descriptor value types do not match. {parent} is "${parentValueType}", {child} is "${childValueType}"`);
  }
}

function checkAccessorDescriptors(parent, child, reportor) {

}

function checkDescriptors(parent, child, reportor) {
  if (parent === undefined) {
    reportor.error(`{child} marked as @override but {parent} was not defined (perhaps misspelled?)`);
  }

  const parentType = getDescriptorType(parent);
  const childType = getDescriptorType(child);

  if (parentType !== childType) {
    reportor.error(`Descriptor types do not match. {parent} is "${parentType}", {child} is "${childType}"`);
  }

  switch (childType) {
    case 'data':
      checkDataDescriptors(parent, child, reportor);
      break;

    case 'accessor':
      checkAccessorDescriptors(parent, child, reportor);
      break;
  }
}

export function override(klass, key, descriptor) {
  const superKlass = Object.getPrototypeOf(klass);
  const superDescriptor = Object.getOwnPropertyDescriptor(superKlass, key);
  const reportor = new SyntaxErrorReporter(key, superKlass, klass);

  checkDescriptors(superDescriptor, descriptor, reportor);
  
  return descriptor;
}