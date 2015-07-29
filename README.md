# core-decorators.js [![Build Status](https://travis-ci.org/jayphelps/core-decorators.js.svg?branch=master)](https://travis-ci.org/jayphelps/core-decorators.js)
Library of [ES2016 (ES7) decorators](https://github.com/wycats/javascript-decorators) inspired by languages that come with built-ins like @​override, @​deprecate, etc, similar to [pre-defined Annotations in Java](https://docs.oracle.com/javase/tutorial/java/annotations/predefined.html). Note that unlike Java annotations, decorators are functions which are applied at runtime.

### Get It

A version compiled to ES5 in CJS format is published to npm as [`core-decorators`](https://www.npmjs.com/package/core-decorators)
```bash
npm install core-decorators --save
```

This form could be consumed by any ES2016 (ES7) transpiler that supports decorators like [babel.js](https://babeljs.io/) with `babel --optional es7.decorators,es7.objectRestSpread` or `babel --stage 1` or using the recent iterations of TypeScript.

_*note that the compiled code is intentionally not checked into this repo_

## Decorators

* [@autobind](#autobind)
* [@readonly](#readonly)
* [@override](#override)
* [@deprecate](#deprecate-alias-deprecated)
* [@debounce](#debounce)
* [@suppressWarnings](#suppresswarnings)
* [@memoize](#memoize)
* [@nonenumerable](#nonenumerable)
* [@nonconfigurable](#nonconfigurable)

##### Proposed (not implemented, PRs welcome!):
* @mixin
* @instrument/profile
* @throttle
* @private

## Docs

### @autobind

Forces invocations of this function to always have `this` refer to the class instance, even if the function is passed around or would otherwise lose its `this` context. e.g. `var fn = context.method;`

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
import { deprecate } from 'core-decorators';

class Editor {
  
  content = '';

  @debounce(500)
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

### @nonenumerable

Marks a property or method as not being enumerable.

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

### @memoize

Initial implementation included, likely slow. WIP.
