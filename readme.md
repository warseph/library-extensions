# Library extensions

This are simple utilities used to extend an existing library.

# Installation
```
$ npm install --save library-extensions
```

# Usage
Use the `create` method to create a new extension function:
```js
const libExt = require('library-extensions');
const test = {value: 1};

const sumExt = libExt.create('sum', (object, sum) => object.value + sum);
```

Use the `bundle` method to create the bundle object with all your extensions
```js
const MyExtension = libExt.bundle([sumExt]);
```
With the generated bundle you can call your method statically, e.g.:
```js
console.log(MyExtension.sum(test, 3)); // 4
```
Or you can extend an object with the bundled methods:
```js
MyExtension.extend(test);
console.log(test.sum(3)); // 4
```
You can also use the extension with a class' prototype to extend all instanced
objects.

**Warning:** if a method already exists with the extension name on the object
you are extending an `Error` will be thrown.

If you need more examples on how to use this look at:
- [promise-flow-extensions](https://github.com/warseph/promise-flow-extensions)
- [rx-flow-extensions](https://github.com/warseph/rx-flow-extensions)
