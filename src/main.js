// Keys are strings or classes;
// Values are functions that return the implementation/value
var registry = {};

const isClass = o => typeof o === 'function' && typeof o.constructor === 'function';

function inject(obj) {
  const c = obj.$inject ? obj.$inject.constructor : null;
  if (c === Array) {
    obj.$inject.forEach(function (i) {
      obj[i] = get(i);
    });
  } else if (c === Object) {
    for (var key in obj.$inject) { // eslint-disable-line guard-for-in
      var dep = get(obj.$inject[key]);
      if (!dep) {
        throw new DIError(`Cannot inject ${key} into ${obj}`);
      }
      obj[key] = dep;
    }
  }
  return obj;
}

function get(key) {
  return registry[key] ? inject(registry[key]()) : null;
}

function doBind(key, obj) {
  if (isClass(obj)) {
    registry[key] = () => new obj(); // eslint-disable-line new-cap
  } else {
    registry[key] = () => obj;
  }
}

function bindInstance(clazz, instance) {
  if (instance instanceof clazz) {
    doBind(clazz, instance);
  } else {
    throw new DIError(`${instance} is not instance of ${clazz}`);
  }
}

function bindClass(clazz, subclass) {
  if (subclass.prototype instanceof clazz) {
    doBind(clazz, subclass);
  } else {
    throw new DIError(`${subclass} is not instance of ${clazz}`);
  }
}

function bind(service, obj) {
  if (isClass(service)) {
    if (typeof obj === 'object') {
      bindInstance(service, obj);
    } else if (isClass(obj)) {
      bindClass(service, obj);
    } else {
      throw new DIError(`Cannot bind ${obj} to a class (${service})`);
    }
  } else if (typeof service === 'string') {
    doBind(service, obj);
  } else {
    throw new DIError(`Unrecognized service type: ${service}`);
  }
}

function reset() {
  registry = {};
}

function DIError(message) {
  this.name = 'DIError';
  this.message = message;
  this.stack = (new Error()).stack;
}
DIError.prototype = Object.create(Error.prototype);
DIError.prototype.constructor = DIError;

export {
	DIError
};
export default {
  get: get,
  bind: bind,
  inject: inject,
  reset: reset
};
