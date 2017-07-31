'use strict';

var R = require('ramda');
var is = require('is_js');

var Ru = R.map(R.curry, {
	applyTo: function applyTo(obj, fn) {
		return fn(obj);
	},
	compareProps: function compareProps(props, a, b) {
		// determine property compare function (lt or gt) based on + or -
		var propCompares = R.map(function (prop) {
			return prop[0] == '-' ? R.gt : R.lt;
		}, props);
		// remove + and - from property names
		props = R.map(R.replace(/^(-|\+)/, ''), props);
		// determine which properties are equal
		var equalProps = R.map(function (prop) {
			return R.equals(a[prop], b[prop]);
		}, props);
		// find first non-equal property
		var index = R.findIndex(R.equals(false), equalProps);
		// if found then compare that property
		if (index >= 0) return R.comparator(propCompares[index])(a[props[index]], b[props[index]]);
		// return all properties equal
		return 0;
	},
	complementC: function complementC(fn) {
		return R.curry(R.nAry(fn.length, function () {
			return !fn.apply(this, arguments);
		}));
	},
	defaults: function defaults(def, obj) {
		return R.merge(def, Ru.filterObj(R.complement(is.undefined), obj));
	},
	defaultsR: function defaultsR(def, obj) {
		return Ru.mergeR(def, Ru.filterObjR(R.complement(is.undefined), obj));
	},
	mergeR: function mergeR(a, b) {
		var obj = R.clone(a);
		R.forEach(function (key) {
			return obj[key] = is.json(obj[key]) && is.json(b[key]) ? Ru.mergeR(obj[key] || {}, b[key]) : b[key];
		}, R.keys(b));
		return obj;
	},
	filterObj: function filterObj(pred, obj) {
		return R.pick(R.filter(function (key) {
			return pred(obj[key]);
		}, R.keys(obj)), obj);
	},
	filterObjR: function filterObjR(pred, obj) {
		return R.map(function (v) {
			return is.json(v) ? Ru.filterObjR(pred, v) : v;
		}, Ru.filterObj(R.anyPass([is.json, pred]), obj));
	},
	isEmptyC: function isEmptyC(fn) {
		return R.curry(R.nAry(fn.length, function () {
			return R.isEmpty(fn.apply(this, arguments));
		}));
	},
	isNotEmptyC: function isNotEmptyC(fn) {
		return R.curry(R.nAry(fn.length, function () {
			return !R.isEmpty(fn.apply(this, arguments));
		}));
	},
	matchGroups: function matchGroups(reg, str) {
		var m,
		    g = [];
		// avoid infinite loop
		if (!reg.global) {
			var match = reg.exec(str);
			if (match) g.push(match.slice(1));
		} else {
			var previousIndex = -1;
			while ((m = reg.exec(str)) && previousIndex != m.index) {
				g.push(m.slice(1));
				previousIndex = m.index;
			}
		}
		return g;
	},
	pickValues: function pickValues(keys, obj) {
		return R.compose(R.values, R.pick(keys))(obj);
	},
	rmap: function rmap(obj, fns) {
		return R.map(Ru.applyTo(obj), fns);
	},
	sumProps: function sumProps(keys, obj) {
		return R.sum(Ru.pickValues(keys, obj));
	},
	sumColumn: function sumColumn(key, objs) {
		return R.sum(R.map(R.prop(key), objs));
	},
	subsetOf: function subsetOf(set, sub) {
		return R.reduce(R.and, true, R.map(R.contains(R.__, set), sub));
	},
	toNumber: function toNumber(x) {
		return Number(x);
	},
	toString: function toString(x) {
		return String(x);
	},
	toDate: function toDate(x) {
		return new Date(x);
	},
	trace: function trace(msg, x) {
		console.log(msg, x);return x;
	},
	zipApply: function zipApply(fns, objs) {
		return R.zipWith(R.call, fns, objs);
	},
	substring: function substring(start, end, str) {
		return str.substring(start, end || undefined);
	},
	pathCommon: function pathCommon(delimiter, path, obj) {
		return R.path(R.split(delimiter, path))(obj);
	}
});

Ru = R.merge(Ru, R.map(R.curry, {
	createIndexOpts: function createIndexOpts(options, keys, objs) {
		options = R.merge({
			unique: false,
			keyDelimiter: '|'
		}, options || {});
		return R.reduce(function (objIndex, obj) {
			var indexKey = Ru.pickValues(keys, obj).join(options.keyDelimiter);
			// create empty entry
			if (!objIndex[indexKey]) objIndex[indexKey] = [];else if (options.unique) throw new Error('Cannot build unique index (index key: ' + indexKey + ')');
			// add to existing entry
			objIndex[indexKey].push(obj);
			return objIndex;
		}, {}, objs);
	}
}));

Ru = R.merge(Ru, {
	mergeAllR: function mergeAllR(a) {
		return R.reduce(Ru.mergeR, {}, a);
	},
	path: Ru.pathCommon('.')
});

Ru.createIndex = Ru.createIndexOpts(null);

module.exports = Ru;