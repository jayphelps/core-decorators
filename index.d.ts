// Type definitions for core-decorators.js 0.21.0
// Project: https://github.com/jayphelps/core-decorators.js
// Definitions by:  Qubo <https://github.com/tkqubo>
//                  dtweedle <https://github.com/dtweedle>
//                  Ron Spickenagel <https://github.com/ronspickenagel>
// TypeScript Version: 3.5.1

export interface PropertyOrMethodDecorator {
  (target: Object, propertyKey: PropertyKey, descriptor?: PropertyDescriptor): void
}

export interface Type<T> extends Function {
  new (...args: any[]): T;
}


/**
 * Forces invocations of this function to always have this refer to the class instance,
 * even if the function is passed around or would otherwise lose its this context. e.g. var fn = context.method;
 */
export function autobind <TFunction extends Function>(target: TFunction): TFunction | void;
/**
 * Forces invocations of this function to always have this refer to the class instance,
 * even if the function is passed around or would otherwise lose its this context. e.g. var fn = context.method;
 */
export function autobind <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;

/**
 * Marks a property or method as not being writable.
 */
export const readonly: PropertyOrMethodDecorator;


/**
 * Checks that the marked method indeed overrides a function with the same signature somewhere on the prototype chain.
 */
export const override: MethodDecorator;


/**
 * Calls console.warn() with a deprecation message. You can also provide an options hash with a url, for further reading.
 * @param msg - Custom message to override the default one.
 * @param options.url - URL for further detail
 */
export function deprecate (msg?: string, options?: { url?: string }): PropertyOrMethodDecorator
/**
 * Calls console.warn() with a deprecation message. You can also provide an options hash with a url, for further reading.
 * @param msg - Custom message to override the default one.
 * @param options.url - URL for further detail
 */
export function deprecate <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
/**
 * Calls console.warn() with a deprecation message. You can also provide an options hash with a url, for further reading.
 * @param msg - Custom message to override the default one.
 * @param options.url - URL for further detail
 */
export function deprecated (msg?: string, options?: { url?: string }): PropertyOrMethodDecorator
/**
 * Calls console.warn() with a deprecation message. You can also provide an options hash with a url, for further reading.
 * @param msg - Custom message to override the default one.
 * @param options.url - URL for further detail
 */
export function deprecated <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;


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
 * (Deprecated) Initial implementation included, likely slow. WIP.
 */
export const memoize: MethodDecorator;


/**
 * Immediately applies the provided function and arguments to the method, allowing you to wrap methods with arbitrary helpers like those provided by lodash.
 * @param decorator - Decorator to apply
 * @param args - Argument to pass to decorator
 */
export function decorate (decorator: PropertyOrMethodDecorator, ...args:any[]): PropertyOrMethodDecorator;


/**
 * Prevents a property initializer from running until the decorated property is actually looked up.
 * _Note: If you're not using Babel, you must pass initilizer function as a decorator parameter or it will not work._
 *
 * Usage:
 * Babel -       @lazyInitialize myParam = myInitializer()
 * TypeScript -  @lazyInitialize(myInitializer) myParam:myType
 * @param initializer - Value initializer method
 * @param args - Arguments to pass to initializer
 * @see <a href="https://www.npmjs.com/package/core-decorators#lazyinitialize">lazyInitialize Caveats</a>
 */
export function lazyInitialize(initializer?: Function, args?: any[]);
/**
 * Prevents a property initializer from running until the decorated property is actually looked up.
 * _Note: If you're not using Babel, you must pass initilizer function as a decorator parameter or it will not work._
 *
 * Usage:
 * Babel -       @lazyInitialize myParam = myInitializer()
 * TypeScript -  @lazyInitialize(myInitializer) myParam:myType
 * @param initializer - Value initializer method
 * @param args - Arguments to pass to initializer
 * @see <a href="https://www.npmjs.com/package/core-decorators#lazyinitialize">lazyInitialize Caveats</a>
 */
export function lazyInitialize (target: Object, propertyKey: PropertyKey): void;


/**
 * Uses console.time and console.timeEnd to provide function timings with a unique label whose default prefix is ClassName.method. Supply a first argument to override the prefix:
 * @param label - Override the preifx
 * @param Console - Custom console object
 */
export function time (label?: string, console?: Console): MethodDecorator;
/**
 * Uses console.time and console.timeEnd to provide function timings with a unique label whose default prefix is ClassName.method. Supply a first argument to override the prefix:
 * @param label - Override the preifx
 * @param Console - Custom console object
 */
export function time <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;


/**
 * Marks a property or method as being enumerable
 */
export const enumerable: PropertyOrMethodDecorator;


/**
 * (Deprecated) Creates a new debounced function which will be invoked after wait milliseconds since the time it was invoked. Default timeout is 300 ms.
 * @param wait - Wait time in ms
 * @param triggerOnLeadingq - Trigger function on the leading instead of the trailing edge of the wait interval
 */
export function debounce (wait: number, triggerOnLeading?: boolean): MethodDecorator;
/**
 * (Deprecated) Creates a new debounced function which will be invoked after wait milliseconds since the time it was invoked. Default timeout is 300 ms.
 * @param wait - Wait time in ms
 * @param triggerOnLeadingq - Trigger function on the leading instead of the trailing edge of the wait interval
 */
export function debounce <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void


/**
 * (Deprecated) Creates a new throttled function which will be invoked in every <wait> milliseconds. Default timeout is 300 ms.
 * @param wait [default=300] - Interval in ms
 * @param options.leading [default=true] - Trigger function on the leading.
 * @param options.trailing [default=true] - Trigger function on the trailing edge of the wait interval.
 */
export function throttle (wait?: number, options?: {leading?: boolean, trailing?: boolean} ): MethodDecorator;
/**
 * (Deprecated) Creates a new throttled function which will be invoked in every <wait> milliseconds. Default timeout is 300 ms.
 * @param wait - Interval in ms
 * @param options.leading - Trigger function on the leading.
 * @param options.trailing - Trigger function on the trailing edge of the wait interval.
 */
export function throttle <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void


/**
 * (Deprecated) Mixes in all property descriptors from the provided Plain Old JavaScript Objects (aka POJOs) as arguments.
 * Mixins are applied in the order they are passed, but do not override descriptors already on the class, including those inherited traditionally.
 */
export function mixin (...mixins: object[]): ClassDecorator;
/**
 * (Deprecated) Mixes in all property descriptors from the provided Plain Old JavaScript Objects (aka POJOs) as arguments.
 * Mixins are applied in the order they are passed, but do not override descriptors already on the class, including those inherited traditionally.
 */
export function mixins (...mixins: object[]): ClassDecorator;


/**
 * Extends the new property descriptor with the descriptor from the super/parent class prototype.
 */
export const extendDescriptor: PropertyOrMethodDecorator;


/**
 * Uses console.profile and console.profileEnd to provide function profiling with a unique label whose default prefix is ClassName.method
 * @param prefix - Override the prefix
 * @param runOnce - Because profiling is expensive, set to true to prevent running every time the function is called.
 */
export function profile (prefix?: string | null, runOnce?: boolean): MethodDecorator;
/**
 * Uses console.profile and console.profileEnd to provide function profiling with a unique label whose default prefix is ClassName.method
 * @param prefix - Override the prefix
 * @param msBetweenProfiles - Delay in milliseconds between profiles. Profiling is always ran on the leading edge.
 */
export function profile (prefix?: string | null, msBetweenProfiles?: number): MethodDecorator;
/**
 * Uses console.profile and console.profileEnd to provide function profiling with a unique label whose default prefix is ClassName.method
 * @param prefix - Override the prefix
 * @param shouldProfileCallback - A function that returns a boolean to determine if profiling should occur. The function will have this context of the instance and the arguments to the method will be passed to the function as well. Arrow functions will not receive the instance context.
 */
export function profile (prefix?: string | null, shouldProfileCallback?: (...args:any[]) => boolean): MethodDecorator;
/**
 * Uses console.profile and console.profileEnd to provide function profiling with a unique label whose default prefix is ClassName.method
 */
export function profile <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;


/**
 * The applyDecorators() helper can be used when you don't have language support for decorators like in Babel 6 or even with vanilla ES5 code without a transpiler.
 */
export const applyDecorators: (Class: Type<any> | Function, props: Record<string,{[i:string]: PropertyOrMethodDecorator}>) => any;
