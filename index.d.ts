export interface PropertyOrMethodDecorator extends MethodDecorator, PropertyDecorator {
  (target: object, propertyKey: string | symbol): void;
}

export interface Deprecate extends MethodDecorator {
  (message?: string, option?: DeprecateOption): MethodDecorator;
}

export interface DeprecateOption {
  url: string;
}

export const autobind: Function;
export const readonly: PropertyOrMethodDecorator;
export const override: MethodDecorator;
export const deprecate: Deprecate;
export const deprecated: Deprecate;
export const suppressWarnings: MethodDecorator;
export const nonenumerable: PropertyOrMethodDecorator;
export const nonconfigurable: PropertyOrMethodDecorator;
export const memoize: MethodDecorator;
export function decorate(func: Function, ...args: any[]): MethodDecorator;
export const lazyInitialize: PropertyDecorator;
export function time(label: string, console?: Console): MethodDecorator;
