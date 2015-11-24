# core-decorators.js [![Build Status](https://travis-ci.org/jayphelps/core-decorators.js.svg?branch=master)](https://travis-ci.org/jayphelps/core-decorators.js)
Library of [JavaScript decorators](https://github.com/wycats/javascript-decorators) (sometimes erroneously stated as ES2016 or ES7) inspired by languages that come with built-ins like @​override, @​deprecate, etc, similar to [pre-defined Annotations in Java](https://docs.oracle.com/javase/tutorial/java/annotations/predefined.html). Note that unlike Java annotations, decorators are functions which are applied at runtime.

It also includes a single class decorator, `@mixin` for applying object descriptors to a given class.

_*compiled code is intentionally not checked into this repo_

### Get It

A version compiled to ES5 in CJS format is published to npm as [`core-decorators`](https://www.npmjs.com/package/core-decorators)
```bash
npm install core-decorators --save
```

This can be consumed by any transpiler that supports decorators like [babel.js](https://babeljs.io/) or using the recent iterations of TypeScript. To use with babel, you must include the correct babel plugins for decorator [parsing](http://babeljs.io/docs/plugins/syntax-decorators/) and [transformation](http://babeljs.io/docs/plugins/transform-decorators/) or use [stage-1](http://babeljs.io/docs/plugins/preset-stage-1/). *Babel 6 [does not yet support decorators](https://phabricator.babeljs.io/T2645), use Babel 5 until that is fixed.*

## Decorators

##### For Properties and Methods
* [@autobind](#autobind)
* [@readonly](#readonly)
* [@override](#override)
* [@deprecate](#deprecate-alias-deprecated)
* [@debounce](#debounce)
* [@throttle](#throttle) :new:
* [@suppressWarnings](#suppresswarnings)
* [@enumerable](#enumerable) :new:
* [@nonenumerable](#nonenumerable)
* [@nonconfigurable](#nonconfigurable)
* [@decorate](#decorate) :new:

##### For Classes
* [@mixin](#mixin-alias-mixins) :new:


##### Proposed (not implemented, PRs welcome!):
* @instrument/profile
* @assertArguments(arg1 => arg1, arg2 => arg2)
* @private

## Docs

### @autobind

Forces invocations of this function to always have `this` refer to the class instance, even if the function is passed around or would otherwise lose its `this` context. e.g. `var fn = context.method;` Popular with React components.

```js
import { autobind } from 'core-decorators';

class Person {
  @autobind
  getPerson() {
  	return this;
  }
}

let person = new Person();
let getPerson = person.getPerson;

getPerson() === person;
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

Marks a property or method as not being writable.

```js
import { nonconfigurable } from 'core-decorators';

class Meal {
  @nonconfigurable
  entree = 'steak';
}

var dinner = new Meal();

Object.defineProperty(dinner, 'entree', {
  enumerable: false
});
// Cannot redefine property: entree

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

# Future Compatibility
Since most people can't keep up to date with specs, it's important to note that ES2016 (including the decorators spec this relies on) is in-flux and subject to breaking changes. In fact, the [biggest change is coming shortly](https://github.com/wycats/javascript-decorators/pull/36) but I am active in the appropriate communities and will be keeping this project up to date as things progress. For the most part, these changes will usually be transparent to consumers of this project--that said, core-decorators has not yet reached 1.0 and may in fact introduce breaking changes. If you'd prefer not to receive these changes, be sure to lock your dependency to [PATCH](http://semver.org/). You can track the progress of core-decorators@1.0.0 in the [The Road to 1.0](https://github.com/jayphelps/core-decorators.js/issues/15) ticket.
