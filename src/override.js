import { decorate } from './private/utils';

const GENERIC_FUNCTION_ERROR = '{child} does not properly override {parent}';
const FUNCTION_REGEXP = /^function ([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?(\([^\)]*\))[\s\S]+$/;

class SyntaxErrorReporter {
  parentKlass;
  childKlass;
  parentDescriptor;
  childDescriptor;
  
  get key() {
    return this.childDescriptor.key;  
  }
  
  get parentNotation() {
    return `${this.parentKlass.constructor.name}#${this.parentPropertySignature}`;
  }

  get childNotation() {
    return `${this.childKlass.constructor.name}#${this.childPropertySignature}`;
  }
  
  get parentTopic() {
    return this._getTopic(this.parentDescriptor);
  }
  
  get childTopic() {
    return this._getTopic(this.childDescriptor);
  }
  
  _getTopic(descriptor) {
    if (descriptor === undefined) {
      return null;  
    }
    
    if ('value' in descriptor) {
      return descriptor.value;
    }
    
    if ('get' in descriptor) {
      return descriptor.get;
    }
    
    if ('set' in descriptor) {
      return descriptor.set;
    }
  }
  
  get parentPropertySignature() {
    return this._extractTopicSignature(this.parentTopic); 
  }
  
  get childPropertySignature() {
    return this._extractTopicSignature(this.childTopic); 
  }
  
  _extractTopicSignature(topic) {
    switch (typeof topic) {
      case 'function':
        return this._extractFunctionSignature(topic);
      default:
        return this.key;
    }
  }
  
  _extractFunctionSignature(fn) {
    return fn
      .toString()
      .replace(
        FUNCTION_REGEXP,
        (match, name = this.key, params) => name + params
      );
  }

  constructor(parentKlass, childKlass, parentDescriptor, childDescriptor) {
    this.parentKlass = parentKlass;
    this.childKlass = childKlass;
    this.parentDescriptor = parentDescriptor;
    this.childDescriptor = childDescriptor;
  }
  
  assert(condition, msg = '') {
    if (condition !== true) {
      this.error(GENERIC_FUNCTION_ERROR + msg);
    }
  }
  
  error(msg) {
    msg = msg
      // Replace lazily, because they actually might not
      // be available in all cases
      .replace('{parent}', m => this.parentNotation)
      .replace('{child}', m => this.childNotation);
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

function checkFunctionSignatures(parent: Function, child: Function, reporter) {
  reporter.assert(parent.length === child.length);
}

function checkDataDescriptors(parent, child, reporter) {
  const parentValueType = typeof parent.value;
  const childValueType = typeof child.value;
  
  if (parentValueType === 'undefined' && childValueType === 'undefined') {
    // class properties can be any expression, which isn't ran until the
    // the instance is created, so we can't reliably get type information
    // for them yet (per spec). Perhaps when Babel includes flow-type info
    // in runtime? Tried regex solutions, but super hacky and only feasible
    // on primitives, which is confusing for usage...
    reporter.error(`descriptor values are both undefined. (class properties are are not currently supported)'`);
  }
  
  if (parentValueType !== childValueType) {
    const isFunctionOverUndefined = (childValueType === 'function' && parentValueType === undefined);
    // Even though we don't support class properties, this
    // will still handle more than just functions, just in case.
    // Shadowing an undefined value is an error if the inherited
    // value was undefined (usually a class property, not a method)
    if (isFunctionOverUndefined || parentValueType !== undefined) {
      reporter.error(`value types do not match. {parent} is "${parentValueType}", {child} is "${childValueType}"`);
    }
  }
  
  // Switch, in preparation for supporting more types
  switch (childValueType) {
    case 'function':
      checkFunctionSignatures(parent.value, child.value, reporter);
      break;
      
    default:
      reporter.error(`Unexpected error. Please file a bug with: {parent} is "${parentValueType}", {child} is "${childValueType}"`);
      break;
  }
}

function checkAccessorDescriptors(parent, child, reporter) {
  const parentHasGetter = typeof parent.get === 'function';
  const childHasGetter = typeof child.get === 'function';
  const parentHasSetter = typeof parent.set === 'function';
  const childHasSetter = typeof child.set === 'function';
  
  if (parentHasGetter || childHasGetter) {
    if (!parentHasGetter && parentHasSetter) {
      reporter.error(`{parent} is setter but {child} is getter`);
    }
    
    if (!childHasGetter && childHasSetter) {
      reporter.error(`{parent} is getter but {child} is setter`);
    }
    
    checkFunctionSignatures(parent.get, child.get, reporter);
  }
  
  if (parentHasSetter || childHasSetter) {
    if (!parentHasSetter && parentHasGetter) {
      reporter.error(`{parent} is getter but {child} is setter`);
    }
    
    if (!childHasSetter && childHasGetter) {
      reporter.error(`{parent} is setter but {child} is getter`);
    }
    
    checkFunctionSignatures(parent.set, child.set, reporter);
  }
}

function checkDescriptors(parent, child, reporter) {
  const parentType = getDescriptorType(parent);
  const childType = getDescriptorType(child);

  if (parentType !== childType) {
    reporter.error(`descriptor types do not match. {parent} is "${parentType}", {child} is "${childType}"`);
  }

  switch (childType) {
    case 'data':
      checkDataDescriptors(parent, child, reporter);
      break;

    case 'accessor':
      checkAccessorDescriptors(parent, child, reporter);
      break;
  }
}

const suggestionTransforms = [
  key => key.toLowerCase(),
  key => key.toUpperCase(),
  key => key + 's',
  key => key.slice(0, -1),
  key => key.slice(1, key.length),
];

function findPossibleAlternatives(superKlass, key) {
  for (let i = 0, l = suggestionTransforms.length; i < l; i++) {
    const fn = suggestionTransforms[i];
    const suggestion = fn(key);

    if (suggestion in superKlass) {
      return suggestion;
    }
  }
  
  return null;
}

function handleDescriptor(target, key, descriptor) {
  descriptor.key = key;
  const superKlass = Object.getPrototypeOf(target);
  const superDescriptor = Object.getOwnPropertyDescriptor(superKlass, key);
  const reporter = new SyntaxErrorReporter(superKlass, target, superDescriptor, descriptor);
  
  if (superDescriptor === undefined) {
    const suggestedKey = findPossibleAlternatives(superKlass, key);
    const suggestion = suggestedKey ? `\n\n  Did you mean "${suggestedKey}"?` : '';
    reporter.error(`No descriptor matching {child} was found on the prototype chain.${suggestion}`);
  }
  
  checkDescriptors(superDescriptor, descriptor, reporter);
  
  return descriptor;
}

export default function override(...args) {
  return decorate(handleDescriptor, args);
}
