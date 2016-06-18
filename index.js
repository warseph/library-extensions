'use strict';

const implement = (obj, name, method) => {
  if (obj[name] !== undefined) {
    throw new Error(`'${name}' already exists!`);
  }
  obj[name] = method;
  return obj;
};

module.exports = {
  create: (name, fn) => ({
    name,
    static: fn,
    extend: (obj) => implement(obj, name, function () {
      return fn.apply(null, [this].concat([].slice.call(arguments)));
    })
  }),
  bundle(extensions) {
    const bundle = {
      extend(promiseObject) {
        extensions.forEach(ext => ext.extend(promiseObject));
        return promiseObject;
      }
    };
    extensions.forEach(ext => implement(bundle, ext.name, ext.static));
    return bundle;
  }
};
