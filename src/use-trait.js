import { decorate } from './private/utils'

const isFunction = (function ({toString}) {
  const tag = toString.call(toString)
  return value => toString.call(value) === tag
})(Object.prototype)

const {push: appendToArray} = Array.prototype

const {
  defineProperty,
  getOwnPropertyNames,
  getOwnPropertySymbols,
  getOwnPropertyDescriptor
} = Object

function safeAssign(target, source, ignoredProperties = {}) {
  const properties = getOwnPropertyNames(source)
  appendToArray.apply(properties, getOwnPropertySymbols(source))

  for (let i = 0, n = properties.length; i < n; ++i) {
    const prop = properties[i]

    if (ignoredProperties[prop]) {
      continue
    }

    const descriptor = getOwnPropertyDescriptor(source, prop)

    // Only assign own properties.
    if (!prop) {
      continue
    }

    // Do not overwrite existing (own or inherited) properties.
    if (prop in target) {
      throw new Error('the property ' + prop + ' already exists')
    }

    // Copy the property descriptor, not the value to support getters
    // and setters.
    defineProperty(target, prop, descriptor)
  }
}

// Copies the trait's properties (functions, values and
// getters/setters) to the prototype of the class.
//
// If the trait itself is a function/class, its properties will be
// copied directly to the class and the properties of its prototype to
// the class' prototype.
export default function useTrait(trait) {
  return function applyUseTrait(target) {
    if (isFunction(trait)) {
      const {prototype} = trait
      if (prototype) {
        safeAssign(target.prototype, prototype)
      }

      safeAssign(target, trait, {
        // Do not copy function properties.
        arguments: true,
        caller: true,
        length: true,
        name: true,
        prototype: true
      })
    } else {
      safeAssign(target.prototype, trait)
    }
  }
}
