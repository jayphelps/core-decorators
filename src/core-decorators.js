/**
 * core-decorators.js
 * (c) 2016 Jay Phelps and contributors
 * MIT Licensed
 * https://github.com/jayphelps/core-decorators.js
 * @license
 */

import override from './override';
import deprecate from './deprecate';
import suppressWarnings from './suppress-warnings';
import memoize from './memoize';
import autobind from './autobind';
import readonly from './readonly';
import enumerable from './enumerable';
import nonenumerable from './nonenumerable';
import nonconfigurable from './nonconfigurable';
import debounce from './debounce';
import throttle from './throttle';
import decorate from './decorate';
import mixin from './mixin';
import lazyInitialize from './lazy-initialize';
import time from './time';
import extendDescriptor from './extendDescriptor';

// Helper to apply decorators to a class without transpiler support
import applyDecorators from './applyDecorators';


export {
	override,
	deprecate,
	deprecate as deprecated,
	suppressWarnings,
	memoize,
	autobind,
	readonly,
	enumerable,
	nonenumerable,
	nonconfigurable,
	debounce,
	throttle,
	decorate,
	mixin,
	mixin as mixins,
	lazyInitialize,
	time,
	extendDescriptor,
	// Helper to apply decorators to a class without transpiler support
	applyDecorators
};