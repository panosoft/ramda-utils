var R = require('ramda');
var Ru = require('../lib');

// TODO use real testing lib

var o = {
	a: 1,
	b: 2,
	c: 3
};

// rmap (uses applyTo)
console.log(R.sum(Ru.rmap(o, R.map(R.prop, ['a', 'b'])))); // 3
// zipApply
console.log(Ru.zipApply(R.map(R.prop, ['a', 'b']), R.repeat(o, 2))); // [1, 2]
// filterObj
console.log(Ru.filterObj(x => x >= 2, o)); // {b:2, c:3}
// pickValues
console.log(Ru.pickValues(R.keys(o), o)); // [1, 2, 3]
// trace
R.compose(R.identity, Ru.trace('after prop:'), R.prop('a'))(o); 	// after prop: 1
// sumProps
console.log(Ru.sumProps(R.keys(o), o)); // 6
// sumColumn
var o1 = {a:10}, o2 = {a:20}, o3 = {a:30};
console.log(Ru.sumColumn('a')([o1, o2, o3])); // 60
// subsetOf
var s = [1, 2, 3, 4, 5, 6];
var sub1 = [2, 5, 6]; // is subset of s
var sub2 = [2, 1, 7]; // is NOT subset of s
console.log(Ru.subsetOf(s, sub1)); // true
console.log(Ru.subsetOf(s, sub2)); // false
// complementC
var lastNameEq = R.propEq('lastName');
var lastNameNeq = Ru.complementC(lastNameEq);
console.log('complementC: ' + lastNameEq('Smith')({lastName: 'Jones'})); // false
console.log('complementC: ' + lastNameNeq('Smith')({lastName: 'Jones'})); // true
// isEmptyC & isNotEmptyC
var a = ['abc', 'xyz'];
console.log('isNotEmptyC: ' + R.any(Ru.isNotEmptyC(R.match('123')), a)); // false
console.log('isEmptyC: ' + R.all(Ru.isEmptyC(R.match('123')), a)); // true
console.log('isNotEmptyC: ' + R.any(Ru.isNotEmptyC(R.match('xyz')), a)); // true
console.log('isEmptyC: ' + R.all(Ru.isEmptyC(R.match('xyz')), a)); // false
// compareProps
var o = [
	{
		b: true,
		n: 10,
		s: 'test',
		d: new Date('1/1/2015')
	},
	{
		b: true,
		n: 12,
		s: 'aaaa',
		d: new Date('1/1/2015')
	},
	{
		b: false,
		n: 12,
		s: 'aaaa',
		d: new Date('1/1/2015')
	},
	{
		b: false,
		n: -1,
		s: 'aaaa',
		d: new Date('1/1/2015')
	},
	{
		b: false,
		n: 12,
		s: 'zzzz',
		d: new Date('1/1/2015')
	},
	{
		b: false,
		n: 3,
		s: 'xyz',
		d: new Date('1/1/2000')
	},
	{
		b: true,
		n: 1,
		s: 'abc',
		d: new Date('1/1/1999')
	}
];
console.dir(R.sort(Ru.compareProps(['-d', '+s', '-n', 'b']), o));
// matchGroups
var s = 'abcd abbbd ab___d';
var r = /ab(.+?)(d)/g;
console.log(Ru.matchGroups(r, s)); // [ [ 'c', 'd'], [ 'bb', 'd' ], ['___', 'd'] ]
