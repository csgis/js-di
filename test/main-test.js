debugger; // eslint-disable-line no-debugger

import di from '../src/main.js';
import {
	DIError
} from '../src/main.js';
import assert from 'assert';

// Tire implements CarPart
class VehiclePart {
  getValue() {
    throw new Error();
  }
}
class Tire extends VehiclePart {
  getValue() {
    return 1000;
  }
}

// Car implements Vehicle interface
class Vehicle {
  getPart() {
    throw new Error();
  }
}

class Car extends Vehicle {
  constructor() {
    super();
    this.$inject = {
      part: VehiclePart
    };
  }

  getPart() {
		return this.part; // eslint-disable-line
  }
}

// Non related class
class House {}

describe('di',  function () {
  beforeEach(() => di.reset());
  it('binds values to strings', function () {
    di.bind('v', 42);
    assert.equal(42, di.get('v'));
  });

  it('throws error if binding values to classes', function () {
    try {
      di.bind(VehiclePart, 42);
      assert.fail();
    } catch (e) {
      assert(e instanceof DIError);
    }
  });

  it('throws error if binding to numbers', function () {
    try {
      di.bind(58, 42);
      assert.fail();
    } catch (e) {
      assert(e instanceof DIError);
    }
  });

  it('binds instances to classes', function () {
    var tire = new Tire();
    di.bind(VehiclePart, tire);
    assert.strictEqual(tire, di.get(VehiclePart));
  });

  it('throws error if binding not implementing instances', function () {
    try {
      di.bind(Vehicle, new House());
    } catch (e) {
      assert(e instanceof DIError);
    }
  });

  it('binds subclasses to classes', function () {
    di.bind(VehiclePart, Tire);
    var i1 = di.get(VehiclePart);
    var i2 = di.get(VehiclePart);
    assert.equal(1000, i1.getValue());
    assert.equal(1000, i2.getValue());
    assert(i1 !== i2);
  });

  it('throws error if binding not implementing subclasses', function () {
    try {
      di.bind(Vehicle, House);
    } catch (e) {
      assert(e instanceof DIError);
    }
  });

  it('injects object with $inject array', function () {
    di.bind('v', 42);
    var obj = {
      $inject: ['v']
    };
    di.inject(obj);
    assert.equal(42, obj.v);
  });

  it('injects object with $inject object', function () {
    di.bind('v', 42);
    var obj = {
      $inject: {
        value: 'v'
      }
    };
    di.inject(obj);
    assert.equal(42, obj.value);
  });

  it('injects object without $inject', function () {
    di.bind('v', 42);
    var obj = {};
    di.inject(obj);
    assert(!obj.value);
  });

  it('injects get value', function () {
    di.bind(VehiclePart, Tire);
    di.bind(Vehicle, Car);

    var vehicle = di.get(Vehicle);
    assert(vehicle instanceof Car);
    assert(vehicle.getPart() instanceof Tire);
    assert.equal(1000, vehicle.getPart().getValue());
  });

  it('thorws an error if getting an instance with unresolved injections', function () {
    di.bind(Vehicle, Car);
    try {
      di.get(Vehicle);
    } catch (e) {
      assert(e instanceof DIError);
    }
  });
});
