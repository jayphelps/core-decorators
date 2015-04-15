# core-decorators.js
Library of ES7 decorators inspired by languages that come with built-ins like @​override, @​deprecated, etc

The idea is these decorators would be used to ensure code sanity, but would be removed in production builds via a Babel plugin.


### @override

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
  //
  //   Did you mean "kickDog"?
}
```

### @deprecated

```js
import { deprecated } from 'core-decorators';

class Person {
  @deprecated
  kickDog() {}

  @deprecated('We stopped animal abuse')
  kickDogHard() {}
 
  @deprecated('We stopped animal abuse', { url: 'http://humanesociety.org/issues/abuse_neglect/' })
  kickDogHarder() {}
}

let person = new Person();

person.kickDog();
// DEPRECATION Person#kickDog: This function will be removed in future versions.

person.kickDogHard();
// DEPRECATION Person#kickDogHard: We stopped animal abuse

person.kickDogHarder();
// DEPRECATION Person#kickDogHarder: We stopped animal abuse
//
//     See http://humanesociety.org/issues/abuse_neglect/ for more details.
//
```

### @suppressWarnings

```js
import { suppressWarnings } from 'core-decorators';

class Person {
  @deprecated
  kickDog() {}
  
  @suppressWarnings
  kickDogWithoutWarning() {
    this.kickDog();
  }
}

let person = new Person();

person.kickDogWithoutWarning();
// no warning is logged
```