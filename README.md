# core-decorators.js [![Build Status](https://travis-ci.org/jayphelps/core-decorators.js.svg?branch=master)](https://travis-ci.org/jayphelps/core-decorators.js)
Library of [JavaScript stage-0 decorators](https://github.com/wycats/javascript-decorators) (aka ES2016/ES7 decorators [but that's not accurate](https://medium.com/@jayphelps/please-stop-referring-to-proposed-javascript-features-as-es7-cad29f9dcc4b)) inspired by languages that come with built-ins like @​override, @​deprecate, @​autobind, @​mixin and more. Popular with React/Angular, but is framework agnostic. Similar to [Annotations in Java](https://docs.oracle.com/javase/tutorial/java/annotations/predefined.html) but unlike Java annotations, decorators are functions which are applied at runtime.

_*compiled code is intentionally not checked into this repo_

### Get It

A version compiled to ES5 in CJS format is published to npm as [`core-decorators`](https://www.npmjs.com/package/core-decorators)
```bash
npm install core-decorators --save
```

This can be consumed by any transpiler that supports stage-0 of the decorators spec, like [babel.js](https://babeljs.io/) version 5 or using the recent iterations of TypeScript. *Babel 6 [does not yet support decorators](https://phabricator.babeljs.io/T2645), use Babel 5 or the [`applyDecorators()` helper](#applydecorators-helper) until that is fixed.*

##### Bower/globals

A globals version is available [here in the artifact repo](https://github.com/jayphelps/core-decorators-artifacts), or via `$ bower install core-decorators`. It defines a global variable `CoreDecorators`, which can then be used as you might expect: `@CoreDecorators.autobind()`, etc.

I *highly* recommend against using that globals build as it's quite strange you're using decorators (a proposed future feature of JavaScript) while not using ES2015 modules, a spec ratified feature used by nearly every modern framework. Also--[bower is on its deathbed](https://github.com/bower/bower/pull/1748) and IMO for very good reasons.

## Decorators

##### For Properties and Methods
* [@readonly](#readonly)
* [@nonconfigurable](#nonconfigurable)
* [@decorate](#decorate)
* [@extendDescriptor](#extenddescriptor) :new:

##### For Properties
* [@nonenumerable](#nonenumerable)
* [@lazyInitialize](#lazyinitialize)

##### For Methods
* [@autobind](#autobind)
* [@deprecate](#deprecate-alias-deprecated)
* [@suppressWarnings](#suppresswarnings)
* [@enumerable](#enumerable)
* [@override](#override)
* [@debounce](#debounce)
* [@throttle](#throttle)
* [@time](#time)

##### For Classes
* [@autobind](#autobind)
* [@mixin](#mixin-alias-mixins)

## Helpers

* [applyDecorators()](#applydecorators-helper) :new:

## Docs

### @autobind

> Note: there is a bug in `react-hot-reloader <= 1.3.0` (they fixed in [`2.0.0-alpha-4`](https://github.com/gaearon/react-hot-loader/pull/182)) which prevents this from working as expected. [Follow it here](https://github.com/jayphelps/core-decorators.js/issues/48)

Forces invocations of this function to always have `this` refer to the class instance, even if the function is passed around or would otherwise lose its `this` context. e.g. `var fn = context.method;` Popular with React components.

Individual methods:

```js
import { autobind } from 'core-decorators';

class Person {
  @autobind
  getPerson() {
  	return this;
  }
}

let person = new Person();
let { getPerson } = person;

getPerson() === person;
// true
```

Entire Class:

```js
import { autobind } from 'core-decorators';

@autobind
class Person {
  getPerson() {
  	return this;
  }
  
  getPersonAgain() {
    return this;
  }
}

let person = new Person();
let { getPerson, getPersonAgain } = person;

getPerson() === person;
// true

getPersonAgain() === person;
// true
```
### @readonly

Marks a property or method as not being writable.

```js
import { readonly } from 'core-decorators';

class Meal {
  @readonly
  entree = 'steak';
}

var dinner = new Meal();
dinner.entree = 'salmon';
// Cannot assign to read only property 'entree' of [object Object]

```

### @override

Checks that the marked method indeed overrides a function with the same signature somewhere on the prototype chain.

Works with methods and getters/setters. Will ensure name, parameter count, as well as descriptor type (accessor/data). Provides a suggestion if it finds a method with a similar signature, including slight misspellings.

```js
import { override } from 'core-decorators';

class Parent {
  speak(first, second) {}
}

class Child extends Parent {
  @override
  speak() {}
  // SyntaxError: Child#speak() does not properly override Parent#speak(first, second)
}

// or

class Child extends Parent {
  @override
  speaks() {}
  // SyntaxError: No descriptor matching Child#speaks() was found on the prototype chain.
  //
  //   Did you mean "speak"?
}
```

### @deprecate (alias: @deprecated)

Calls `console.warn()` with a deprecation message. Provide a custom message to override the default one. You can also provide an options hash with a `url`, for further reading.

```js
import { deprecate } from 'core-decorators';

class Person {
  @deprecate
  facepalm() {}

  @deprecate('We stopped facepalming')
  facepalmHard() {}

  @deprecate('We stopped facepalming', { url: 'http://knowyourmeme.com/memes/facepalm' })
  facepalmHarder() {}
}

let person = new Person();

person.facepalm();
// DEPRECATION Person#facepalm: This function will be removed in future versions.

person.facepalmHard();
// DEPRECATION Person#facepalmHard: We stopped facepalming

person.facepalmHarder();
// DEPRECATION Person#facepalmHarder: We stopped facepalming
//
//     See http://knowyourmeme.com/memes/facepalm for more details.
//
```

### @debounce

Creates a new debounced function which will be invoked after `wait` milliseconds since the time it was invoked. Default timeout is 300 ms.

Optional boolean second argument allows to trigger function on the leading instead of the trailing edge of the wait interval. Implementation is insired by similar method from [UnderscoreJS](http://underscorejs.org/#debounce).

```js
import { debounce } from 'core-decorators';

class Editor {

  content = '';

  @debounce(500)
  updateContent(content) {
    this.content = content;
  }
}
```

### @throttle

Creates a new throttled function which will be invoked in every `wait` milliseconds. Default timeout is 300 ms.

Second argument is optional options:

- `leading`: default to `true`, allows to trigger function on the leading.
- `trailing`: default to `true`, allows to trigger function on the trailing edge of the wait interval.

Implementation is insired by similar method from [UnderscoreJS](http://underscorejs.org/#throttle).

```js
import { throttle } from 'core-decorators';

class Editor {

  content = '';

  @throttle(500, {leading: false})
  updateContent(content) {
    this.content = content;
  }
}
```

### @suppressWarnings

Suppresses any JavaScript `console.warn()` call while the decorated function is called. (i.e. on the stack)

Will _not_ suppress warnings triggered in any async code within.

```js
import { suppressWarnings } from 'core-decorators';

class Person {
  @deprecated
  facepalm() {}

  @suppressWarnings
  facepalmWithoutWarning() {
    this.facepalm();
  }
}

let person = new Person();

person.facepalmWithoutWarning();
// no warning is logged
```

### @enumerable

Marks a method as being enumerable. Note that instance properties are _already_ enumerable, so this is only useful for methods.

```js
import { enumerable } from 'core-decorators';

class Meal {
  pay() {}

  @enumerable
  eat() {}
}

var dinner = new Meal();
for (var key in dinner) {
  key;
  // "eat" only, not "pay"
}

```

### @nonenumerable

Marks a property as not being enumerable. Note that class methods are _already_ nonenumerable, so this is only useful for instance properties.

```js
import { nonenumerable } from 'core-decorators';

class Meal {
  entree = 'steak';

  @nonenumerable
  cost = 20.99;
}

var dinner = new Meal();
for (var key in dinner) {
  key;
  // "entree" only, not "cost"
}

Object.keys(dinner);
// ["entree"]

```

### @nonconfigurable

Marks a property or method so that it cannot be deleted; also prevents it from being reconfigured via `Object.defineProperty`, but **this may not always work how you expect** due to a quirk in JavaScript itself, not this library. Adding the `@readonly` decorator fixes it, but at the cost of obviously making the property readonly (aka `writable: false`). [You can read more about this here.](https://github.com/jayphelps/core-decorators.js/issues/58)

```js
import { nonconfigurable } from 'core-decorators';

class Foo {
  @nonconfigurable
  @readonly
  bar() {};
}

Object.defineProperty(Foo.prototype, 'bar', {
  value: 'I will error'
});
// Cannot redefine property: bar

```

### @decorate

Immediately applies the provided function and arguments to the method, allowing you to wrap methods with arbitrary helpers like [those provided by lodash](https://lodash.com/docs#after). The first argument is the function to apply, all further arguments will be passed to that decorating function.

```js
import { decorate } from 'core-decorators';
import { memoize } from 'lodash';

var count = 0;

class Task {
  @decorate(memoize)
  doSomethingExpensive(data) {
    count++;
    // something expensive;
    return data;
  }
}

var task = new Task();
var data = [1, 2, 3];

task.doSomethingExpensive(data);
task.doSomethingExpensive(data);

count === 1;
// true
```

### @lazyInitialize

Prevents a property initializer from running until the decorated property is actually looked up. Useful to prevent excess allocations that might otherwise not be used, but be careful not to over-optimize things.

```js
import { lazyInitialize } from 'core-decorators';

function createHugeBuffer() {
  console.log('huge buffer created');
  return new Array(1000000);
}

class Editor {
  @lazyInitialize
  hugeBuffer = createHugeBuffer();
}

var editor = new Editor();
// createHugeBuffer() has not been called yet

editor.hugeBuffer;
// logs 'huge buffer created', now it has been called

editor.hugeBuffer;
// already initialized and equals our buffer, so
// createHugeBuffer() is not called again
```

### @mixin (alias: @mixins)

Mixes in all property descriptors from the provided Plain Old JavaScript Objects (aka POJOs) as arguments. Mixins are applied in the order they are passed, but do **not** override descriptors already on the class, including those inherited traditionally.

```js
import { mixin } from 'core-decorators';

const SingerMixin = {
  sing(sound) {
    alert(sound);
  }
};

const FlyMixin = {
  // All types of property descriptors are supported
  get speed() {},
  fly() {},
  land() {}
};

@mixin(SingerMixin, FlyMixin)
class Bird {
  singMatingCall() {
    this.sing('tweet tweet');
  }
}

var bird = new Bird();
bird.singMatingCall();
// alerts "tweet tweet"

```

### @time

Uses `console.time` and `console.timeEnd` to provide function timings with a unique label whose default prefix is `ClassName.method`.  Supply a first argument to override the prefix:

```js
class Bird {
  @time('sing')
  sing() {
  }
}

var bird = new Bird();
bird.sing(); // console.time label will be 'sing-0'
bird.sing(); // console.time label will be 'sing-1'
```

Will polyfill `console.time` if the current environment does not support it. You can also supply a custom `console` object as the second argument with the following methods:

* `myConsole.time(label)`
* `myConsole.timeEnd(label)`
* `myConsole.log(value)`

```js
let myConsole = {
  time: function(label) { /* custom time() method */ },
  timeEnd: function(label) { /* custom timeEnd method */ },
  log: function(str) { /* custom log method */ }
}
```

### @extendDescriptor

Extends the new property descriptor with the descriptor from the super/parent class prototype. Although useful in various circumstances, it's particularly helpful to address the fact that getters and setters share a single descriptor so overriding only a getter or only a setter will blow away the other, without this decorator.

```js
class Base {
  @nonconfigurable
  get foo() {
    return `hello ${this._foo}`;
  }
}

class Derived extends Base {
  @extendDescriptor
  set foo(value) {
    this._foo = value;
  }
}

const derived = new Derived();
derived.foo = 'bar';
derived.foo === 'hello bar';
// true

const desc = Object.getOwnPropertyDescriptor(Derived.prototype, 'foo');
desc.configurable === false;
// true
```

### applyDecorators() helper

The `applyDecorators()` helper can be used when you don't have language support for decorators like in Babel 6 or even with vanilla ES5 code without a transpiler.

```js
class Foo {
  getFoo() {
    return this;
  }
}

// This works on regular function prototypes
// too, like `function Foo() {}`
applyDecorators(Foo, {
  getFoo: [autobind]
});

let foo = new Foo();
let getFoo = foo.getFoo;
getFoo() === foo;
// true
```

# Future Compatibility
Since most people can't keep up to date with specs, it's important to note that the spec is in-flux and subject to breaking changes. In fact, the [biggest change is coming shortly](https://github.com/wycats/javascript-decorators/pull/36) but I am active in the appropriate communities and will be keeping this project up to date as things progress. For the most part, these changes will usually be transparent to consumers of this project--that said, core-decorators has not yet reached 1.0 and may in fact introduce breaking changes. If you'd prefer not to receive these changes, be sure to lock your dependency to [PATCH](http://semver.org/). You can track the progress of core-decorators@1.0.0 in the [The Road to 1.0](https://github.com/jayphelps/core-decorators.js/issues/15) ticket.

# Decorator Order Sometimes Matters
When using multiple decorators on a class, method, or property the order of the decorators sometimes matters. This is a neccesary caveat of decorators because otherwise certain cool features wouldn't be possible. The most common example of this is using `@autobind` and any [Higher-Order Component (HOC)](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) decorator, e.g. Redux's `@connect`. You must `@autobind` your class first before applying the `@connect` HOC.

```js
@connect()
@autobind
class Foo extends Component {}
```
