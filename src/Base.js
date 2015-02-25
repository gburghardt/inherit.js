var Base = function() {

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

	function enhance(Klass) {
		Klass.extend = Base.extend;
		Klass.include = include;

		return Klass;
	}

	function extend() {
		var Klass = typeof arguments[0] == "function"
		        ? arguments[0]
		        : function Klass() {},
		    descriptor = arguments.length == 2
		        ? arguments[1]
		        : arguments[0] || {};

		enhance(Klass);

		if (typeof this === "function") {
			// Set up prototypal inheritance
			Klass.prototype = Object.create(this.prototype);
			Klass.constructor = Klass;

			// Copy "static" methods
			merge(this, Klass);
		}

		// Instance members
		if (descriptor.prototype) {
			merge(descriptor.prototype, Klass.prototype);
		}

		// Class level or "static" members
		if (descriptor.self) {
			merge(descriptor.self, Klass);
		}

		// Include mixins (simulate multiple inheritance)
		if (descriptor.includes) {
			includeAll(descriptor.includes, Klass);
		}

		return Klass;
	}

	return {
		enhance: enhance,
		extend: extend
	};
}();
