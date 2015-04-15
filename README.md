# core-decorators.js
Library of ES7 decorators inspired by languages that come with built-ins like @​override, @​deprecated, etc

The idea is these decorators would be used to ensure code sanity, but would be removed in production builds via a Babel plugin.

```js
import { override } from 'core-decorators';

class Parent {
  kickDog(first, second) {}
}

class Child extends Parent {
  @override
  kickDog() {}
  // SyntaxError: Child#kickDog() does not properly override Parent#kickDog(first, second)
}

// or

class Child extends Parent {
  @override
  kickDogs() {}
  // SyntaxError: No descriptor matching Child#kickDogs() was found on the prototype chain.
  //   Did you mean "kickDog"?
}
```
