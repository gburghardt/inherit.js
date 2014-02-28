describe("Function", function() {
	describe("include", function() {
		it("includes a mixin with instance level methods", function() {
			var Mixin = {
				prototype: {
					foo: function() {
						return "foo";
					}
				}
			};
			var Klass = function() {};
			Klass.include(Mixin);
			var instance = new Klass();

			expect(Klass.prototype.hasOwnProperty("foo")).toBe(true);
			expect(typeof instance.foo).toBe("function");
			expect(instance.foo()).toEqual("foo");
		});

		it("includes a mixin with class level methods", function() {
			var Mixin = {
				self: {
					bar: function() {
						return "bar";
					}
				}
			};
			var Klass = function() {};
			Klass.include(Mixin);

			expect(Klass.hasOwnProperty("bar")).toBe(true);
			expect(Klass.bar()).toEqual("bar");
		});

		it("includes a mixin with both instance and class level methods", function() {
			var Mixin = {
				self: {
					bar: function() {
						return "bar";
					}
				},
				prototype: {
					foo: function() {
						return "foo";
					}
				}
			};
			var Klass = function() {};
			Klass.include(Mixin);
			var instance = new Klass();

			expect(Klass.hasOwnProperty("bar")).toBe(true);
			expect(Klass.bar()).toEqual("bar");
			expect(Klass.prototype.hasOwnProperty("foo")).toBe(true);
			expect(typeof instance.foo).toBe("function");
			expect(instance.foo()).toEqual("foo");
		});

		it("does not override instance level methods", function() {
			var Mixin = {
				prototype: {
					foo: function() {
						return "incorrect";
					}
				}
			};
			var Klass = function() {};
			Klass.prototype.foo = function() {
				return "foo";
			};
			Klass.include(Mixin);
			var instance = new Klass();

			expect(instance.foo).toEqual(Klass.prototype.foo);
			expect(instance.foo()).toEqual("foo");
		});

		it("does not override class level methods", function() {
			var Mixin = {
				self: {
					bar: function() {
						return "incorrect";
					}
				}
			};
			var Klass = function() {};
			Klass.bar = function() {
				return "bar";
			};
			Klass.include(Mixin);

			expect(Klass.bar).not.toEqual(Mixin.self.bar);
			expect(Klass.bar()).toEqual("bar");
		});
	});

	describe("extend", function() {
		it("does not require parameters", function() {
			var Klass = Object.extend();
			var instance = new Klass();
			expect(typeof Klass).toBe("function");
			expect(instance instanceof Klass).toBe(true);
			expect(instance instanceof Object).toBe(true);
		});

		it("defines initialize() if omitted", function() {
			var Klass = Object.extend();
			var instance = new Klass();
			expect(typeof instance.initialize).toBe("function");
		});

		it("sets the constructor to reference the class", function() {
			var Klass = Object.extend();
			var instance = new Klass();
			expect(Klass.prototype.constructor).toBe(Klass);
			expect(instance.constructor).toBe(Klass);
		});

		it("defines class level methods", function() {
			var Klass = Object.extend({
				self: {
					foo: function() {
						return "foo";
					}
				}
			});
			expect(Klass.hasOwnProperty("foo")).toBe(true);
			expect(typeof Klass.foo).toBe("function");
			expect(Klass.foo()).toEqual("foo");
		});

		it("defines instance level methods", function () {
			var Klass = Object.extend({
				prototype: {
					foo: function() {
						return "foo";
					}
				}
			});
			var instance = new Klass();
			expect(Klass.prototype.hasOwnProperty("foo")).toBe(true);
			expect(instance.foo).toEqual(Klass.prototype.foo);
			expect(instance.foo()).toEqual("foo");
		});

		it("defines instance and class level methods", function() {
			var Klass = Object.extend({
				self: {
					foo: function() {
						return "foo";
					}
				},
				prototype: {
					bar: function() {
						return "bar";
					}
				}
			});
			var instance = new Klass();
			expect(typeof Klass.foo).toBe("function");
			expect(Klass.foo()).toEqual("foo");
			expect(Klass.prototype.hasOwnProperty("bar")).toBe(true);
			expect(typeof Klass.prototype.bar).toBe("function");
			expect(instance.bar).toEqual(Klass.prototype.bar);
			expect(instance.bar()).toEqual("bar");
		});

		it("includes a single mixin", function() {
			var Mixin = {
				self: {
					foo: function() {
						return "foo";
					}
				},
				prototype: {
					bar: function() {
						return "bar";
					}
				}
			};
			var Klass = Object.extend({
				includes: Mixin
			});
			var instance = new Klass();
			expect(typeof Klass.foo).toBe("function");
			expect(typeof instance.bar).toBe("function");
		});

		it("includes multiple mixins", function() {
			var Mixin1 = {
				self: {
					foo: function() {
						return "foo";
					}
				},
				prototype: {
					bar: function() {
						return "bar";
					}
				}
			};
			var Mixin2 = {
				prototype: {
					foobar: function() {
						return "foobar";
					}
				}
			};
			var Klass = Object.extend({
				includes: [Mixin1, Mixin2]
			});
			var instance = new Klass();
			expect(typeof Klass.foo).toBe("function");
			expect(typeof instance.bar).toBe("function");
			expect(typeof instance.foobar).toBe("function");
		});

		it("inherits from Object", function() {
			var Klass = Object.extend();
			var instance = new Klass();

			// Internet Explorer does not set the __proto__ property for the "prototype"
			// object of object constructors.
			if (Klass.prototype.hasOwnProperty("__proto__")) {
				expect(Klass.prototype.__proto__).toBe(Object.prototype);
			}

			expect(instance instanceof Klass).toBe(true);
			expect(instance instanceof Object).toBe(true);
			expect(instance.__proto__).toBe(Klass.prototype);
		});

		it("inherits from the parent class", function() {
			var ParentKlass = Object.extend();
			var ChildKlass = ParentKlass.extend();
			var instance = new ChildKlass();
			expect(ChildKlass.prototype.__proto__).toBe(ParentKlass.prototype);
			expect(instance instanceof ChildKlass).toBe(true);
			expect(instance instanceof ParentKlass).toBe(true);
			expect(instance instanceof Object).toBe(true);
		});

		it("inherits instance level methods", function() {
			var ParentKlass = Object.extend({
				prototype: {
					foo: function() {
						return "foo";
					}
				}
			});
			var ChildKlass = ParentKlass.extend();
			expect(ChildKlass.prototype.hasOwnProperty("foo")).toBe(false);
			expect(ChildKlass.prototype.foo).toEqual(ParentKlass.prototype.foo);
		});

		it("inherits class level methods", function() {
			var ParentKlass = Object.extend({
				self: {
					foo: function() {
						return "foo";
					}
				}
			});
			var ChildKlass = ParentKlass.extend();
			expect(ChildKlass.hasOwnProperty("foo")).toBe(true);
			expect(ChildKlass.foo).toEqual(ParentKlass.foo);
		});

		it("does not allow mixins to override class and instance methods", function() {
			var Mixin = {
				self: {
					foo: function() {
						return "incorrect";
					}
				},
				prototype: {
					bar: function() {
						return "incorrect";
					}
				}
			};
			var Klass = Object.extend({
				includes: Mixin,
				self: {
					foo: function() {
						return "foo";
					}
				},
				prototype: {
					bar: function() {
						return "bar";
					}
				}
			});
			var instance = new Klass();
			expect(Klass.foo).not.toEqual(Mixin.self.foo);
			expect(Klass.foo()).toEqual("foo");
			expect(instance.bar).not.toEqual(Mixin.prototype.bar);
			expect(instance.bar()).toEqual("bar");
		});
	});
});
