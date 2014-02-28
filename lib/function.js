(function(global) {

var toString = global.Object.prototype.toString;

function isArray(x) {
	return toString.call(x) === "[object Array]";
}

function merge(source, destination, safe) {
	for (var key in source) {
		if (source.hasOwnProperty(key) && (!safe || !destination.hasOwnProperty(key))) {
			destination[key] = source[key];
		}
	}
}

function includeAll(mixins, Klass) {
	if (!Klass) {
		throw new Error("Missing required argument: Klass");
	}

	mixins = isArray(mixins) ? mixins : [mixins];

	var i = 0, length = mixins.length;

	for (i; i < length; i++) {
		if (!mixins[i]) {
			throw new Error("Mixin at index " + i + " is null or undefined");
		}

		Klass.include(mixins[i]);
	}
}

function include(mixin) {
	var key, Klass = this;

	// include class level methods
	if (mixin.self) {
		merge(mixin.self, Klass, true);
	}

	// include instance level methods
	if (mixin.prototype) {
		merge(mixin.prototype, Klass.prototype, true);
	}

	// include other mixins
	if (mixin.includes) {
		includeAll(mixin.includes, Klass);
	}

	if (mixin.included) {
		mixin.included(Klass);
	}

	mixin = null;
}

function extend(descriptor) {
	descriptor = descriptor || {};

	var key, i, length, ParentKlass = this;

	// Constructor function for our new class
	var ChildKlass = function ChildKlass() {
		this.initialize.apply(this, arguments);
	};

	// "inherit" class level methods
	merge(ParentKlass, ChildKlass);

	// new class level methods
	if (descriptor.self) {
		merge(descriptor.self, ChildKlass);
	}

	// Set up true prototypal inheritance
	ChildKlass.prototype = Object.create(ParentKlass.prototype);

	// new instance level methods
	if (descriptor.prototype) {
		merge(descriptor.prototype, ChildKlass.prototype);
	}

	// apply mixins
	if (descriptor.includes) {
		includeAll(descriptor.includes, ChildKlass);
	}

	ChildKlass.prototype.initialize = ChildKlass.prototype.initialize || function initialize() {};
	ChildKlass.prototype.constructor = ChildKlass;

	ParentKlass = descriptor = null;

	return ChildKlass;
}

// Make "include" available to the World
if (!global.Function.prototype.include) {
	global.Function.prototype.include = include;
}

// Make "extend" available to the World
if (!global.Function.prototype.extend) {
	if (global.Object.extend) {
		// Some JavaScript libraries already have an "extend" function
		global.Object._extend = extend;
	}

	global.Function.prototype.extend = extend;
}

})(this);
