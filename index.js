'use strict';

const implement = (obj, name, method) => {
  if (obj[name] !== undefined) {
    throw new Error(`'${name}' already exists!`);
  }
  method._libExtMethod = true;
  obj[name] = method;
  return obj;
};

const reset = (obj, name) => {
  if (!obj[name] || !obj[name]._libExtMethod) {
    throw new Error(`'${name}' is different from the library extension!`);
  }
  delete obj[name];
  return obj;
};

module.exports = {
  create: (name, fn) => ({
    name,
    static: fn,
    extend: obj => implement(obj, name, function () {
      return fn.apply(null, [this].concat([].slice.call(arguments)));
    }),
    reset: obj => reset(obj, name)
  }),
  bundle(extensions) {
    const bundle = {
      extend(object) {
        extensions.forEach(ext => ext.extend(object));
        return object;
      },
      reset(object) {
        extensions.forEach(ext => ext.reset(object));
        return object;
      }
    };
    extensions.forEach(ext => implement(bundle, ext.name, ext.static));
    return bundle;
  }
};
