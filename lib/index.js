var R = require('ramda');

var Ru = R.mapObj(R.curry, {
	applyTo: (o, f) => f(o),
	rmap: (o, fs) => R.map(Ru.applyTo(o), fs),
	zipApply: (fs, os) => R.zipWith(R.call, fs, os),
	filterObj: (p, o) => R.pick(R.filter(k => p(o[k]), R.keys(o)), o),
	pickValues: (ks, o) => R.compose(R.values, R.pick(ks))(o),
	trace: (msg, x) => { console.log(msg, x); return x; },
	sumProps: (props, obj) => R.sum(R.map(Ru.applyTo(obj), R.map(R.prop, props))),
	sumColumn: (prop, objs) => R.sum(R.map(R.prop(prop), objs)),
	subsetOf: (s, sub) => R.reduce(R.and, true, R.map(R.contains(R.__, s), sub)),
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
	matchGroups: (r, s) => {
		var m, g = [];
		while (m = r.exec(s))
			g.push(m.slice(1));
		return g;
	},
	toNumber: x => Number(x),
	toString: x => String(x),
	toDate: x => new Date(x)
});

module.exports = Ru;
