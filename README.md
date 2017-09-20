# JavaScript Dependency Injection

[![Build Status](https://travis-ci.org/csgis/js-di.svg?branch=master)](https://travis-ci.org/csgis/js-di)
[![codecov](https://codecov.io/gh/csgis/js-di/branch/master/graph/badge.svg)](https://codecov.io/gh/csgis/js-di)

A simple and lightweight JavaScript library for Dependency Injection/Inversion of Control (DI/IoC) with no dependencies.

Suitable for Node and browsers.

Written strictly in ES2015; Webpack/Babel/... should be managed by consumers.

There are other libraries that are more powerful but also are more complex and with bigger goals (such as [InversifyJS](http://inversify.io/)). We focus on simplicity and cleanest API possible.


## Getting started

Install with npm:

```bash
npm install --save @csgis/di
```

or yarn:

```bash
yarn add @csgis/di
```

And use it in your module:

```js
import di from '@csgis/di';

class Map {
  addLayer(opts) {
    // ...
  }
}

class OLMap extends Map {
  addLayer(opts) {
    console.log('OLMap adding layer...');
    // ...
  }
}

di.bind(Map, OLMap);

var map = di.get(Map);
map.addLayer({
  // ...
});
```

You might need to bundle it properly for running, for example, in Node:

```bash
yarn add -D webpack
node_modules/.bin/webpack --target node index.js bundle.js
node bundle.js
```

## Examples

### Binding literal values

```js
di.bind('value', 42);
```

### Binding singletons

```js
class Map {
  addLayer(opts) {}
}
class OLMap extends Map {
  addLayer(opts) {
    // ...
  }
}

di.bind(Map, new OLMap());
```

### Binding classes

```js
class Map {
  addLayer(opts) {}
}
class OLMap extends Map {
  addLayer(opts) {
    /// ...
  }
}

di.bind(Map, OLMap);
```


### Binding classes with injected members:

```js
class Renderer {
  render() {}
}
class WebGLRenderer extends Renderer {
  render() {
    // ...
  }
}
class Map {
  addLayer(opts) {}
}
class OLMap extends Map {
  constructor() {
    super();
    this.$inject = {
      renderer: Renderer
    };
  }

  addLayer(opts) {
    // ...
    this.renderer.render();
  }
}


di.bind(Renderer, new WebGLRenderer());
di.bind(Map, OLMap);
di
.get(Map) // here the new OLMap instance has the renderer member injected with a the WebGLRenderer instance.
.addLayer({
  // ...
}); // this calls render in injected WebGLRenderer as part of the addLayer method in OLMap.
```

### Injecting objects

```js
class Map {
  addLayer(opts) {}
}
class OLMap extends Map {
  addLayer(opts) {
    // ...
  }
}

di.bind(Map, new OLMap());

var obj = {
  $inject = {
    mymap: Map
  }
}
di.inject(obj);

obj.mymap.addLayer({
  // ...
});
```

Removing all bindings:

```js
di.reset();
```

## API

### `bind(service, obj)`

Binds a literal, object or class to a service.

* `service` (*string* or *class*): If *class*, it checks that `obj` is either a subclass or an instance of `service`.
* `obj`: It can be anything when `service` is a string.

  It must be a subclass or an instance of `service` when `service` is a class.
  If it's an instance, `get` will return the exact instance; if it's a class, it will return a new instance by calling the constructor with no params.

Throws `DIError`.

### `inject(obj)`

Injects an existing object based on its `$inject` property.

* `obj` An object with an `$inject` property. `$inject` is an object whose keys are property names and values are services.

Throws `DIError`.

### `get(service)`

Gets a bound literal or object.

* `service`: A string or class previously used with the `bind` function.

Throws `DIError`.

### `reset()`

Removes all bindings.

### `DIError`

Generic error for injecting problems. Extends `Error`. Can be imported by:

```js
import { DIError } from '@csgis/di';
```
