var R = require('ramda');
var Ru = require('../ramdaUtils');

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
// pickValues
console.log(Ru.pickValues(R.keys(o))(o)); // [1, 2, 3]
// trace
R.compose(R.identity, Ru.trace('after prop:'), R.prop('a'))(o); 	// after prop: 1
// sumProps
console.log(Ru.sumProps(R.keys(o), o)); // 6
// sumColumn
var o1 = {a:10}, o2 = {a:20}, o3 = {a:30};
console.log(Ru.sumColumn('a')([o1, o2, o3])); // 60
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
