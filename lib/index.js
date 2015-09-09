var R = require('ramda');

var Ru = R.mapObj(R.curry, {
	applyTo: (obj, fn) => fn(obj),
	rmap: (obj, fns) => R.map(Ru.applyTo(obj), fns),
	zipApply: (fns, objs) => R.zipWith(R.call, fns, objs),
	filterObj: (pred, obj) => R.pick(R.filter(key => pred(obj[key]), R.keys(obj)), obj),
	pickValues: (keys, obj) => R.compose(R.values, R.pick(keys))(obj),
	trace: (msg, x) => { console.log(msg, x); return x; },
	sumProps: (keys, obj) => R.sum(Ru.pickValues(keys, obj)),
	sumColumn: (key, objs) => R.sum(R.map(R.prop(key), objs)),
	subsetOf: (set, sub) => R.reduce(R.and, true, R.map(R.contains(R.__, set), sub)),
	complementC: fn => {
		return R.curry(R.nAry(fn.length, function() {
			return !fn.apply(this, arguments);
		}));
	},
	isEmptyC: fn => {
		return R.curry(R.nAry(fn.length, function() {
			return R.isEmpty(fn.apply(this, arguments));
		}));
	},
	isNotEmptyC: fn => {
		return R.curry(R.nAry(fn.length, function() {
			return !R.isEmpty(fn.apply(this, arguments));
		}));
	},
	compareProps: (props, a, b) => {
		// determine property compare function (lt or gt) based on + or -
		var propCompares = R.map(prop => prop[0] == '-' ? R.gt : R.lt, props);
		// remove + and - from property names
		props = R.map(R.replace(/^(-|\+)/, ''), props);
		// determine which properties are equal
		var equalProps = R.map(prop => R.equals(a[prop], b[prop]), props);
		// find first non-equal property
		var index = R.findIndex(R.equals(false), equalProps);
		// if found then compare that property
		if (index >= 0)
			return R.comparator(propCompares[index])(a[props[index]], b[props[index]]);
		// return all properties equal
		return 0;
	},
	matchGroups: (reg, str) => {
		var m, g = [];
		// avoid infinite loop
		if (!reg.global) {
			g.push(reg.exec(str).slice(1));
		}
		else {
			while (m = reg.exec(str)) g.push(m.slice(1));
		}
		return g;
	},
	toNumber: x => Number(x),
	toString: x => String(x),
	toDate: x => new Date(x)
});

module.exports = Ru;
