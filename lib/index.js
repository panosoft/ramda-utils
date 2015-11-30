var R = require('ramda');

var Ru = R.map(R.curry, {
	applyTo: (obj, fn) => fn(obj),
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
	complementC: fn => {
		return R.curry(R.nAry(fn.length, function() {
			return !fn.apply(this, arguments);
		}));
	},
	defaults: (def, obj) => R.merge(def, Ru.filterObj(val => typeof val !== 'undefined' ,obj)),
	filterObj: (pred, obj) => R.pick(R.filter(key => pred(obj[key]), R.keys(obj)), obj),
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
	pickValues: (keys, obj) => R.compose(R.values, R.pick(keys))(obj),
	rmap: (obj, fns) => R.map(Ru.applyTo(obj), fns),
	sumProps: (keys, obj) => R.sum(Ru.pickValues(keys, obj)),
	sumColumn: (key, objs) => R.sum(R.map(R.prop(key), objs)),
	subsetOf: (set, sub) => R.reduce(R.and, true, R.map(R.contains(R.__, set), sub)),
	toNumber: x => Number(x),
	toString: x => String(x),
	toDate: x => new Date(x),
	trace: (msg, x) => { console.log(msg, x); return x; },
	zipApply: (fns, objs) => R.zipWith(R.call, fns, objs),
	substring: (start, end, str) => str.substring(start, end || undefined)
});

Ru = R.merge(Ru, R.map(R.curry, {
	createIndexOpts: (options, keys, objs) => {
		options = R.merge({
			unique: false,
			keyDelimiter: '|'
		}, options || {});
		return R.reduce((objIndex, obj) => {
			var indexKey = Ru.pickValues(keys, obj).join(options.keyDelimiter);
			// create empty entry
			if (!objIndex[indexKey])
				objIndex[indexKey] = [];
			else if (options.unique)
				throw new Error(`Cannot build unique index (index key: ${indexKey})`);
			// add to existing entry
			objIndex[indexKey].push(obj);
			return objIndex;
		}, {}, objs);
	}
}));

Ru.createIndex = Ru.createIndexOpts(null);

module.exports = Ru;