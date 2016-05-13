var expect = require('chai')
	.use(require('sinon-chai'))
	.expect;
var assert = require('chai').assert;
var R = require('ramda');
var Ru = require('../lib');
var sinon = require('sinon');

describe('applyTo', function () {
	it('apply an object to a function', function () {
		var obj = {a: 'a'};
		var fn = (obj) => obj.a;
		expect(Ru.applyTo(obj, fn)).to.equal('a');
	});
});
describe('compareProps', function () {
	it('return comparator function that can be used in sort', function () {
		var props = ['-d', '+s', '-n', 'b'];
		var list = [
			{ b: true, n: 10, s: 'test', d: new Date('1/1/2015') },
			{ b: false, n: -1, s: 'aaaa', d: new Date('1/1/2015') },
			{ b: true, n: 12, s: 'aaaa', d: new Date('1/1/2015') },
			{ b: false, n: 3, s: 'xyz', d: new Date('1/1/2000') },
			{ b: false, n: 12, s: 'aaaa', d: new Date('1/1/2015') }
		];
		var sortedList = [
			{ b: false, n: 12, s: 'aaaa', d: new Date('1/1/2015') },
			{ b: true, n: 12, s: 'aaaa', d: new Date('1/1/2015') },
			{ b: false, n: -1, s: 'aaaa', d: new Date('1/1/2015') },
			{ b: true, n: 10, s: 'test', d: new Date('1/1/2015') },
			{ b: false, n: 3, s: 'xyz', d: new Date('1/1/2000') }
		];
		expect(R.sort(Ru.compareProps(props), list)).to.deep.equal(sortedList);
	});
});
describe('complementC', function () {
	it('curried complement', function () {
		var fn = (a,b) => b;
		expect(fn(null, false)).to.be.false;
		expect(Ru.complementC(fn)(null)(false)).to.be.true;
	});
});
describe('defaults', function () {
	it('set all undefined obj properties to their corresponding values in def', function () {
		var def = {a: 1, b: 2, c: 3};
		var obj = {a: 4, b: undefined};
		var defObj = Ru.defaults(def, obj);
		expect(defObj).to.be.a('object')
			.and.have.all.keys(['a','b','c']);
		expect(defObj.a).to.equal(4);
		expect(defObj.b).to.equal(2);
		expect(defObj.c).to.equal(3);
	});
});
describe('defaultsR', function () {
	it('Recursively set all undefined obj properties to their corresponding values in def', function () {
		var def = {a: 1, b: 2, c: 3, o: {x: 1, z: 3}};
		var obj = {a: 4, b: undefined, o: {x: undefined, y: 2}};
		expect(Ru.defaultsR(def, obj)).to.deep.equal({a: 4, b: 2, c: 3, o: {x: 1, y: 2, z: 3}});
	});
});
describe('filterObj', function () {
	// sometimes called `where`
	it('filter object by property value', function () {
		var obj = {a: true, b: false, c: true};
		var pred = x => x;
		expect(Ru.filterObj(pred, obj)).to.deep.equal({a: true, c: true});
	});
});
describe('filterObjR', function () {
	// sometimes called `where`
	it('Recursively filter object by property value', function () {
		var obj = {a: true, b: false, c: true, o: {a: true, b: false}};
		var pred = x => x;
		expect(Ru.filterObjR(pred, obj)).to.deep.equal({a: true, c: true, o: {a: true}});
	});
});
describe('isEmptyC', function () {
	it('test whether curried function returns a list with zero elements', function () {
		var fn = (a,b) => a+b;
		expect(fn('a','b')).to.equal('ab');
		expect(fn('','')).to.equal('');
		expect(Ru.isEmptyC(fn)('a')('b')).to.be.false;
		expect(Ru.isEmptyC(fn)('')('')).to.be.true;
	});
});
describe('isNotEmptyC', function () {
	it('test whether curried function returns a list with elements', function () {
		var fn = (a,b) => a+b;
		expect(fn('a','b')).to.equal('ab');
		expect(fn('','')).to.equal('');
		expect(Ru.isNotEmptyC(fn)('a')('b')).to.be.true;
		expect(Ru.isNotEmptyC(fn)('')('')).to.be.false;
	});
});
describe('matchGroups', function () {
	var str = 'abcd abbbd ab___d';
	it('return matched groups as an array', function () {
		var reg = /ab(.+?)(d)/g;
		expect(Ru.matchGroups(reg, str)).to.deep.equal([ [ 'c', 'd'], [ 'bb', 'd' ], ['___', 'd'] ]);
	});
	it('return empty arrays if no matched groups', function () {
		var reg = /ab/g;
		expect(Ru.matchGroups(reg, str)).to.deep.equal([ [], [], [] ]);
	});
	it('support non-global RegExp', function () {
		expect(Ru.matchGroups(/(ab)/, str)).to.deep.equal([ ['ab'] ]);
		var match = Ru.matchGroups(/ab/, str);
		expect(match).to.deep.equal([ [] ]);
		expect(match.length).to.equal(1);
		expect(match[0].length).to.equal(0);
	});
	it('infinite loop', function() {
		expect(Ru.matchGroups(/\s*/g, 'xxx')).to.deep.equal([ [] ]);
	});
});
describe('pickValues', function () {
	it('pick values from an object using specified keys', function () {
		var obj = {a: true, b: false, c: true};
		var keys = ['b', 'c'];
		expect(Ru.pickValues(keys, obj)).to.deep.equal([false, true]);
	});
});
describe('rmap', function () {
	it('map an array of functions to their return values by applying an object to each', function () {
		var obj = {a: 'a', b: 'b'};
		var fns = [(obj) => obj.a, (obj) => obj.b];
		expect(Ru.rmap(obj, fns)).to.deep.equal(['a', 'b']);
	});
});
describe('subsetOf', function () {
	it('test if an array is a subset of another', function () {
		var set = [1, 2, 3, 4];
		var sub = [2, 3];
		var notSub = [4, 5];
		expect(Ru.subsetOf(set, sub)).to.be.true;
		expect(Ru.subsetOf(set, notSub)).to.be.false;
	});
});
describe('sumProps', function () {
	it('return sum of specified properties', function () {
		var obj = {a: 1, b: 2, c: 4};
		var keys = ['b', 'c'];
		expect(Ru.sumProps(keys, obj)).to.equal(6);
	});
});
describe('sumColumn', function () {
	it('return sum of the specified property across an array of objects', function () {
		var objs = [{a: 1}, {a: 2}, {a: 4}];
		var key = 'a';
		expect(Ru.sumColumn(key, objs)).to.equal(7);
	});
});
describe('toNumber', function () {
	it('convert value to number', function () {
		var str = '1';
		expect(Ru.toNumber(str)).to.equal(1);
	});
});
describe('toString', function () {
	it('convert value to string', function () {
		var num = 1;
		expect(Ru.toString(num)).to.equal('1');
	});
});
describe('toDate', function () {
	it('convert value to date', function () {
		var str = '1/1/2000';
		expect(Ru.toDate(str)).to.deep.equal(new Date(str));
	});
});
describe('trace', function () {
	var log;
	before(function () {
		log = sinon.stub(console, 'log');
	});
	after(function () {
		log.restore();
	});
	it('log message and argument then return argument', function () {
		var msg = 'X:';
		var fn = R.compose(R.add(1), Ru.trace(msg), R.add(1));
		expect(fn(1)).to.equal(3);
		expect(log).to.be.calledOnce
			.and.calledWithExactly(msg, 2);
	});
});
describe('zipApply', function () {
	it('zip an array of functions and objects into an array of their return values by calling each function with its respective object', function () {
		var objs = [{a: 'a'}, {b: 'b'}];
		var fns = [(obj) => obj.a, (obj) => obj.b];
		expect(Ru.zipApply(fns, objs)).to.deep.equal(['a', 'b']);
	});
});

var indexTestData = [
	{a: 1, b: 'a', c: 'x'},
	{a: 2, b: 'b', c: 'y'},
	{a: 3, b: 'b', c: 'y'},
	{a: 4, b: 'b', c: 'z'}
];
describe('createIndex single key:', function () {
	it('creates an index for an array of objects', function () {
		var expectedIndex = {
			a: [{a: 1, b: 'a', c: 'x'}],
			b: [
				{a: 2, b: 'b', c: 'y'},
				{a: 3, b: 'b', c: 'y'},
				{a: 4, b: 'b', c: 'z'}
			]
		};
		expect(Ru.createIndex(['b'], indexTestData)).to.deep.equal(expectedIndex);
	});
});
describe('createIndex multi key:', function () {
	it('creates an index for an array of objects', function () {
		var expectedIndex = {
			'a&x': [{a: 1, b: 'a', c: 'x'}],
			'b&y': [
				{a: 2, b: 'b', c: 'y'},
				{a: 3, b: 'b', c: 'y'}
			],
			'b&z': [{a: 4, b: 'b', c: 'z'}]
		};
		expect(Ru.createIndexOpts({keyDelimiter: '&'}, ['b', 'c'], indexTestData)).to.deep.equal(expectedIndex);
	});
});
describe('createIndexOpts multi key with UNIQUE:', function () {
	it('creates an index for an array of objects', function () {
		assert.throws(() => Ru.createIndexOpts({unique: true}, ['b', 'c'], indexTestData), Error, 'Cannot build unique index (index key: b|y)');
	});
});
describe('sub-string:', function () {
	it('substring', function () {
		expect(Ru.substring(1, 2, 'abc')).to.equal('b');
	});
	it('substring NO end (null)', function () {
		expect(Ru.substring(1, null, 'abc')).to.equal('bc');
	});
	it('substring NO end (undefined)', function () {
		expect(Ru.substring(1, undefined, 'abc')).to.equal('bc');
	});
});
describe('Path:', () => {
	it('common path', () => {
		expect(Ru.pathCommon('/', 'a/b', {a: {b: 1}})).to.equal(1);
	});
	it('object path', () => {
		expect(Ru.path('a.b', {a: {b: 1}})).to.equal(1);
	});
});
describe('Recursively Merge:', function() {
	it('mergeR', function() {
		var a = {
			r: 1,
			s: 2,
			t: 3,
			u: 4,
			v: 5,
			o: {
				a: 1,
				b: 2,
				c: 3,
				e: 5,
				o: {
					x: 1,
					y: 2,
					z: 3,
					bb: 50
				}
			}
		};
		var b = {
			r: 10,
			s: 20,
			t: 30,
			o: {
				a: 10,
				b: 20,
				c: 30,
				d: 40,
				o: {
					x: 10,
					y: 20,
					z: 30,
					aa: 40
				}
			}
		};
		var result = {
			r: 10,
			s: 20,
			t: 30,
			u: 4,
			v: 5,
			o: {
				a: 10,
				b: 20,
				c: 30,
				d: 40,
				e: 5,
				o: {
					x: 10,
					y: 20,
					z: 30,
					aa: 40,
					bb: 50
				}
			}
		};
		expect(Ru.mergeR(a, b)).to.deep.equal(result);
	});
});
describe('Recursive Merge All:', function() {
	it('mergeAllR', function() {
		var a = {a: 1, o: {a: 1, x: 1}};
		var b = {b: 2, o: {b: 2, x: 2}};
		var c = {c: 3, o: {c: 3, x: 3}};
		var result = {a: 1, b:2, c: 3, o: {a: 1, b: 2, c: 3, x: 3}}
		expect(Ru.mergeAllR([a, b, c])).to.deep.equal(result);
	});
	it('mergeAllR non-object/object', function() {
		var a = {a: 1, o: {a: 1, x: 1, oo: 'a'}};
		var b = {b: 2, o: {b: 2, x: 2, oo: {y: 2}}};
		var c = {c: 3, o: {c: 3, x: 3, oo: {x: 1}}};
		var result = {a: 1, b:2, c: 3, o: {a: 1, b: 2, c: 3, x: 3, oo: {x: 1, y: 2}}}
		expect(Ru.mergeAllR([a, b, c])).to.deep.equal(result);
	});
	it('mergeAllR object/non-object', function() {
		var a = {a: 1, o: {a: 1, x: 1, oo: {y: 2}}};
		var b = {b: 2, o: {b: 2, x: 2, oo: 'a'}};
		var c = {c: 3, o: {c: 3, x: 3, oo: {x: 1}}};
		var result = {a: 1, b:2, c: 3, o: {a: 1, b: 2, c: 3, x: 3, oo: {x: 1}}}
		expect(Ru.mergeAllR([a, b, c])).to.deep.equal(result);
	});
});
