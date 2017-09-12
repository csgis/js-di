import di from '../src/main.js';
import {
	DIError
} from '../src/main.js';

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

beforeEach(() => di.reset());

it('binds values to strings', function () {
  di.bind('v', 42);
  expect(di.get('v')).toBe(42);
});

it('throws error if binding values to classes', function () {
  try {
    di.bind(VehiclePart, 42);
    fail();
  } catch (e) {
    expect(e instanceof DIError).toBe(true);
  }
});

it('throws error if binding to numbers', function () {
  try {
    di.bind(58, 42);
    fail();
  } catch (e) {
    expect(e instanceof DIError).toBe(true);
  }
});

it('binds instances to classes', function () {
  var tire = new Tire();
  di.bind(VehiclePart, tire);
  expect(di.get(VehiclePart)).toBe(tire);
});

it('throws error if binding not implementing instances', function () {
  try {
    di.bind(Vehicle, new House());
  } catch (e) {
    expect(e instanceof DIError).toBe(true);
  }
});

it('binds subclasses to classes', function () {
  di.bind(VehiclePart, Tire);
  var i1 = di.get(VehiclePart);
  var i2 = di.get(VehiclePart);
  expect(i1.getValue()).toBe(1000);
  expect(i2.getValue()).toBe(1000);
  expect(i1).not.toBe(i2);
});

it('throws error if binding not implementing subclasses', function () {
  try {
    di.bind(Vehicle, House);
  } catch (e) {
    expect(e instanceof DIError).toBe(true);
  }
});

it('injects object with $inject array', function () {
  di.bind('v', 42);
  var obj = {
    $inject: ['v']
  };
  di.inject(obj);
  expect(obj.v).toBe(42);
});

it('injects object with $inject object', function () {
  di.bind('v', 42);
  var obj = {
    $inject: {
      value: 'v'
    }
  };
  di.inject(obj);
  expect(obj.value).toBe(42);
});

it('injects object without $inject', function () {
  di.bind('v', 42);
  var obj = {};
  di.inject(obj);
  expect(obj.value).toBeUndefined();
});

it('injects get value', function () {
  di.bind(VehiclePart, Tire);
  di.bind(Vehicle, Car);

  var vehicle = di.get(Vehicle);
  expect(vehicle instanceof Car).toBe(true);
  expect(vehicle.getPart() instanceof Tire).toBe(true);
  expect(vehicle.getPart().getValue()).toBe(1000);
});

it('thorws an error if getting an instance with unresolved injections', function () {
  di.bind(Vehicle, Car);
  try {
    di.get(Vehicle);
  } catch (e) {
    expect(e instanceof DIError).toBe(true);
  }
});
