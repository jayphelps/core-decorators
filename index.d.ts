// Type definitions for core-decorators.js 0.19
// Project: https://github.com/jayphelps/core-decorators.js
// Definitions by: Qubo <https://github.com/tkqubo>
//                 dtweedle <https://github.com/dtweedle>
// TypeScript Version: 2.4.1

export interface PropertyOrMethodDecorator extends MethodDecorator, PropertyDecorator {
  (target: object, propertyKey: string | symbol): void;
}

export interface Deprecate extends MethodDecorator {
  (message?: string, option?: DeprecateOption): MethodDecorator;
}

export interface DeprecateOption {
  url: string;
}

/**
 * Forces invocations of this function to always have this refer to the class instance,
 * even if the function is passed around or would otherwise lose its this context. e.g. var fn = context.method;
 */
export const autobind: Function;
/**
 * Marks a property or method as not being writable.
 */
export const readonly: PropertyOrMethodDecorator;
/**
 * Checks that the marked method indeed overrides a function with the same signature somewhere on the prototype chain.
 */
export const override: MethodDecorator;
/**
 * Calls console.warn() with a deprecation message. Provide a custom message to override the default one. You can also provide an options hash with a url, for further reading.
 */
export const deprecate: Deprecate;
/**
 * Calls console.warn() with a deprecation message. Provide a custom message to override the default one. You can also provide an options hash with a url, for further reading.
 */
export const deprecated: Deprecate;
/**
 * Suppresses any JavaScript console.warn() call while the decorated function is called. (i.e. on the stack)
 */
export const suppressWarnings: MethodDecorator;
/**
 * Marks a property or method as not being enumerable.
 */
export const nonenumerable: PropertyOrMethodDecorator;
/**
 * Marks a property or method as not being writable.
 */
export const nonconfigurable: PropertyOrMethodDecorator;
/**
 * Initial implementation included, likely slow. WIP.
 */
export const memoize: MethodDecorator;
/**
 * Immediately applies the provided function and arguments to the method, allowing you to wrap methods with arbitrary helpers like those provided by lodash.
 * The first argument is the function to apply, all further arguments will be passed to that decorating function.
 */
export function decorate(func: Function, ...args: any[]): MethodDecorator;
/**
 * Prevents a property initializer from running until the decorated property is actually looked up.
 * Useful to prevent excess allocations that might otherwise not be used, but be careful not to over-optimize things.
 */
export const lazyInitialize: PropertyDecorator;
/**
 * Uses console.time and console.timeEnd to provide function timings with a unique label whose default prefix is ClassName.method. Supply a first argument to override the prefix:
 */
export function time(label: string, console?: Console): MethodDecorator;
