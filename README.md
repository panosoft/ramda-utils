# ramda-utils

Utilities built on top of Ramda.

[![Travis](https://img.shields.io/travis/panosoft/ramda-utils.svg)](https://travis-ci.org/panosoft/ramda-utils)

## Installation

```sh
npm install @panosoft/ramda-utils
```

## Usage

```js
var Ru = require('@panosoft/ramda-utils');
```

## API

- [`applyTo`](#applyTo)
- [`compareProps`](#compareProps)
- [`complementC`](#complementC)
- [`createIndex`](#createIndex)
- [`createIndexOpts`](#createIndexOpts)
- [`defaults`](#defaults)
- [`defaultsR`](#defaultsR)
- [`filterObj`](#filterObj)
- [`filterObjR`](#filterObjR)
- [`isEmptyC`](#isEmptyC)
- [`isNotEmptyC`](#isNotEmptyC)
- [`matchGroups`](#matchGroups)
- [`mergeAllR`](#mergeAllR)
- [`mergeR`](#mergeR)
- [`path`](#path)
- [`pathCommon`](#pathCommon)
- [`pickValues`](#pickValues)
- [`rmap`](#rmap)
- [`subsetOf`](#subsetOf)
- [`substring`](#substring)
- [`sumProps`](#sumProps)
- [`sumColumn`](#sumColumn)
- [`toNumber`](#toNumber)
- [`toString`](#toString)
- [`toDate`](#toDate)
- [`trace`](#trace)
- [`zipApply`](#zipApply)

---

<a name="applyTo"></a>
### applyTo ( obj , fn )

Apply an object to a function

__Arguments__

- `obj` - An object.
- `fn` - A function.

__Example__

```js
var obj = {a: 'a'};
var fn = (obj) => obj.a;
Ru.applyTo(obj, fn) // 'a';
```

---

<a name="compareProps"></a>
### compareProps ( props , a , b )

Returns a curried comparator function that can be used with `R.sort`. Supports any number of sort orders (i.e. property1 ascending, property 2 descending, etc.). It also supports type based sorting (i.e. recognizes `Date`, `Number`, etc. and sorts them appropriately).

__Arguments__

- `props` - A string or an array of strings used to determine the sort order to apply. Each string signifies a property name to compare. A `'+'` prefix is used to signify ascending order and a `'-'` prefix is used to signify descending order.
- `a` - A value to compare.
- `b` - A value to compare.

__Example__

```js
var list = [
  { b: true,  n: 10,  s: 'test',  d: new Date('1/1/2015') },
  { b: false, n: -1,  s: 'aaaa',  d: new Date('1/1/2015') },
  { b: true,  n: 12,  s: 'aaaa',  d: new Date('1/1/2015') },
  { b: false, n: 3,   s: 'xyz',   d: new Date('1/1/2000') },
  { b: false, n: 12,  s: 'aaaa',  d: new Date('1/1/2015') }
];
var props = ['-d', '+s', '-n', 'b'];
R.sort(Ru.compareProps(props), list);
/*
  [
    { b: false, n: 12,  s: 'aaaa',  d: new Date('1/1/2015') },
    { b: true,  n: 12,  s: 'aaaa',  d: new Date('1/1/2015') },
    { b: false, n: -1,  s: 'aaaa',  d: new Date('1/1/2015') },
    { b: true,  n: 10,  s: 'test',  d: new Date('1/1/2015') },
    { b: false, n: 3,   s: 'xyz',   d: new Date('1/1/2000') }
  ];
 */
```
---

<a name="complementC"></a>
### complementC ( fn )

Returns a curried complement.

__Arguments__

- `fn` - A function.

__Example__

```js
var fn = (a,b) => b;
fn(null, false) // false;
Ru.complementC(fn)(null)(false) // true;
```

---

<a name="createIndex"></a>
### createIndex ( keys, objs )

Returns an indexed for an array of objects. This is just a partially applied version of [`createIndexOpts`](#createIndexOpts) with default `options`.

__Arguments__

- `keys` - An array of keys to index on. If multiple keys are given then the keys are created with the default delimiter between keys, |. To change this delimiter use [`createIndexOpts`](#createIndexOpts).
- `objs` - An array of objects to index.

__Example with single key__

```js
var indexTestData = [
	{a: 1, b: 'a', c: 'x'},
	{a: 2, b: 'b', c: 'y'},
	{a: 3, b: 'b', c: 'y'},
	{a: 4, b: 'b', c: 'z'}
];
createIndex(['b'], indexTestData);
// 		{
//			a: [{a: 1, b: 'a', c: 'x'}],
//			b: [
//				{a: 2, b: 'b', c: 'y'},
//				{a: 3, b: 'b', c: 'y'},
//				{a: 4, b: 'b', c: 'z'}
//			]
//		}

```

__Example with composite key__


```js
var indexTestData = [
	{a: 1, b: 'a', c: 'x'},
	{a: 2, b: 'b', c: 'y'},
	{a: 3, b: 'b', c: 'y'},
	{a: 4, b: 'b', c: 'z'}
];
createIndex(['b', 'c'], indexTestData);
//  {
//        'a|x': [{a: 1, b: 'a', c: 'x'}],
//        'b|y': [
//            {a: 2, b: 'b', c: 'y'},
//            {a: 3, b: 'b', c: 'y'}
//        ],
//        'b|z': [{a: 4, b: 'b', c: 'z'}]
//    }
```
---

<a name="createIndexOpts"></a>
### createIndexOpts ( options, keys, objs )

Returns an indexed for an array of objects with the specified `options`.

__Arguments__

- `options`:
    - `unique` - (default: `false`) If `true` then if a key is not unique and Exception is thrown.
    - `keyDelimiter` - (default: `|`) The delimiter used between object values to build the index key. This MUST be a character that is guaranteed to NOT be in the values otherwise the index may not be built properly.
- `keys` - An array of keys to index on.
- `objs` - An array of objects to index.

__Examples__

```js
var indexTestData = [
	{a: 1, b: 'a', c: 'x'},
	{a: 2, b: 'b', c: 'y'},
	{a: 3, b: 'b', c: 'y'},
	{a: 4, b: 'b', c: 'z'}
];
createIndexOpts({keyDelimiter: '&'}, ['b', 'c'], indexTestData);
//    {
//        'a&x': [{a: 1, b: 'a', c: 'x'}],
//        'b&y': [
//            {a: 2, b: 'b', c: 'y'},
//            {a: 3, b: 'b', c: 'y'}
//        ],
//        'b&z': [{a: 4, b: 'b', c: 'z'}]
//    }

```

---

<a name="defaults"></a>
### defaults ( def , obj )

Creates a new object with the own properties of `def` merged with the _defined_ own properties of `obj`.

Any properties of `obj` that resolve to `undefined` will be replaced by the corresponding properties in `def` if they exist. Otherwise, properties that resolve to `undefined` in both `obj` and `def` will be omitted in the returned object.

__Arguments__

- `def` - An object containing default properties.
- `obj` - An object to default.

__Example__

```js
var def = {a: 1, b: 2, c: 3};
var obj = {a: 4, b: undefined};
Ru.defaults(def, obj); // { a: 4, b: 2, c: 3 }
```

---

<a name="defaultsR"></a>
### defaultsR ( def , obj )

RECURSIVE version of [`defaults`](#defaults). NOTE: When comparing keys, recursion only occurs if both keys are objects, otherwise a simple non-recursive replacement occurs.

__Arguments__

- `def` - An object containing default properties.
- `obj` - An object to default.

__Example__

```js
var def = {a: 1, b: 2, c: 3, o: {x: 1, z: 3}};
var obj = {a: 4, b: undefined, o: {x: undefined, y: 2}};
Ru.defaultsR(def, obj); // {a: 4, b: 2, c: 3, o: {x: 1, y: 2, z: 3}}
```

---

<a name="filterObj"></a>
### filterObj ( pred , obj )

Filters an object by property.

__Arguments__

- `pred` - A function used to test each object property. It is called with the property `value` and should return a `Boolean`.
- `obj` - An object to filter.

__Example__

```js
var obj = {a: true, b: false, c: true};
var pred = (x) => x;
Ru.filterObj(pred, obj) // {a: true, c: true}
```

---

<a name="filterObjR"></a>
### filterObjR ( pred , obj )

RECURSIVE version of [`filterObj`](#filterObj). NOTE: `pred` is NOT applied to object keys which means all object keys (recursively) will be included.

__Arguments__

- `pred` - A function used to test each object property. It is called with the property `value` and should return a `Boolean`.
- `obj` - An object to filter.

__Example__

```js
var obj = {a: true, b: false, c: true, o: {a: true, b: false}};
var pred = (x) => x;
Ru.filterObjR(pred, obj) // {a: true, c: true, o: {a: true}}
```

---

<a name="isEmptyC"></a>
### isEmptyC ( fn )

Returns a curried function that tests whether the original function returns a list with zero elements when called.

__Arguments__

- `fn` - A function.

__Example__

```js
var fn = (a,b) => a+b;
fn('a','b') // 'ab'
fn('','') // ''

Ru.isEmptyC(fn)('a')('b') // false;
Ru.isEmptyC(fn)('')('') // true;
```

---

<a name="isNotEmptyC"></a>
### isNotEmptyC ( fn )

Returns a curried function that tests whether the original function returns a list with elements when called.

__Arguments__

- `fn` - A function.

__Example__

```js
var fn = (a,b) => a+b;
fn('a','b') // 'ab'
fn('','')   // ''

Ru.isNotEmptyC(fn)('a')('b')  // true;
Ru.isNotEmptyC(fn)('')('')    // false;
```

---

<a name="matchGroups"></a>
### matchGroups ( reg , str )

Applies a Regular Expression to a String and returns the matched groups as an array of arrays. Returns an empty array, [], if no match.

__Arguments__

- `reg` - A regular expression.
- `str` - A string to search.

__Example__

```js
var str = 'abcd abbbd ab___d';
var reg = /ab(.+?)(d)/g;
Ru.matchGroups(reg, str); // [ [ 'c', 'd'], [ 'bb', 'd' ], ['___', 'd'] ]

Ru.matchGroups(/xyz/, str); // []
```

---

<a name="mergeAllR"></a>
### mergeAllR ( objs )

RECURSIVE version of R.mergeAll (see Ramda).  NOTE: When comparing keys, recursion only occurs if both keys are objects, otherwise a simple non-recursive replacement occurs.

__Arguments__

- `objs` - Array of objects to merge.

__Example__

```js
var a = {a: 1, o: {a: 1, x: 1}};
var b = {b: 2, o: {b: 2, x: 2}};
var c = {c: 3, o: {c: 3, x: 3}};
R.mergeAllR([a, b, c]); // {a: 1, b:2, c: 3, o: {a: 1, b: 2, c: 3, x: 3}}

var a = {oo: 'a'}};
var b = {oo: {y: 2}}; // this replaces a non-object with {y: 2}
var c = {oo: {x: 1}};
R.mergeAllR([a, b, c]); // {oo: {x: 1, y: 2}}

var a = {oo: {y: 2}};
var b = {oo: 'a'}}; // this replaces the object {y: 2} with a non-object
var c = {oo: {x: 1}};
R.mergeAllR([a, b, c]); // {oo: {x: 1}}

```

---

<a name="mergeR"></a>
### mergeR ( a , b )

RECURSIVE version of R.merge (see Ramda). NOTE: When comparing keys, recursion only occurs if both keys are objects, otherwise a simple non-recursive replacement occurs.

__Arguments__

- `a` - First object to merge.
- `b` - Second object to merge with first.

__Example__

```js
var a = {a: 1, b: 2, d: 4, o: {x: 1, z: 3}};
var b = {a: 10, c: 30, o: {x: 10, y: 20}};
Ru.mergeR(a, b) // {a: 10, b: 2, c: 30, d: 4, o: {x: 10, y: 20, z: 3}}
Ru.mergeR(b, a) // {a: 1, b: 2, c: 30, d: 4, o: {x: 1, y: 20, z: 3}}
```

---

<a name="path"></a>
### path ( path , obj )

Retrieve a value at a given path using the standard `.` path delimiter.

__Arguments__

- `path` - A path to a value within an object.
- `obj` - An object to retrieve value from.

__Example__

```js
Ru.path('a.b', {a: {b: 1}}); // returns 1
```

---

<a name="pathCommon"></a>
### pathCommon ( delimiter, path , obj )

Retrieve a value at a given path with the specified path `delimiter`.

__Arguments__

- `delimiter` - A path delimiter.
- `path` - A path to a value within an object.
- `obj` - An object to retrieve value from.

__Example__

```js
Ru.pathCommon('/', 'a/b', {a: {b: 1}}); // returns 1
```

---

<a name="pickValues"></a>
### pickValues ( keys , obj )

Picks values from an object using the specified keys. Returns a new array.

__Arguments__

- `keys` - A string or an array of strings corresponding to the keys of values to be picked.
- `obj` - An object to pick values from.

__Example__

```js
var obj = {a: true, b: false, c: true};
var keys = ['b', 'c'];
Ru.pickValues(keys, obj) // [false, true]
```

---

<a name="rmap"></a>
### rmap ( obj , fns )

Maps an array of functions to their return values by applying an object to each.

__Arguments__

- `obj` - An object to apply.
- `fns` - A function or an array of functions to map.

__Example__

```js
var obj = {a: 'a', b: 'b'};
var fns = [(obj) => obj.a, (obj) => obj.b];
Ru.rmap(obj, fns) // ['a', 'b']
```

---

<a name="subsetOf"></a>
### subsetOf ( set , sub )

Tests if an array is a subset of another.

__Arguments__

- `set` - An array that defines the complete set.
- `sub` - An array to test.

__Example__

```js
var set = [1, 2, 3, 4];
var sub = [2, 3];
var notSub = [4, 5];
Ru.subsetOf(set, sub);     // true
Ru.subsetOf(set, notSub)); // false
```

---

<a name="substring"></a>
### substring ( start , end, str )

Returns the substring of the specified string. This function differs from the standard JavaScript function in the case where `end` is `null`. In that case, end behaves as if it were not specified and will represent the end of the string.

__Arguments__

- `start` - An integer between 0 and the length of the string, specifying the offset into the string of the first character to include in the returned substring.
- `end` - An integer between 0 and the length of the string, which specifies the offset into the string of the first character not to include in the returned substring. If `null`, then it will extract characters until the end of the string.

__Example__

```js
substring(1, 2, 'abc');     // 'b'
substring(1, null, 'abc'); // 'bc'
```

---

<a name="sumProps"></a>
### sumProps ( keys , obj )

Returns the sum of the specified properties.

__Arguments__

- `keys` - An array of strings used to determine which properties to sum.
- `obj` - An object containing the specified keys.

__Example__

```js
var obj = {a: 1, b: 2, c: 4};
var keys = ['b', 'c'];
Ru.sumProps(keys, obj);  // 6
```

---

<a name="sumColumn"></a>
### sumColumn ( key , objs )

Return the sum of the specified property across an array of objects.

__Arguments__

- `key` - A string used to determine which property to sum.
- `objs` - An object or an array of objects containing the specified key.

__Example__

```js
var objs = [{a: 1}, {a: 2}, {a: 4}];
var key = 'a';
Ru.sumColumn(key, objs)  // 7
```

---

<a name="toNumber"></a>
### toNumber ( x )

Converts a value to a `Number`.
__Arguments__

- `x` - A value to convert.

__Example__

```js
var str = '1';
Ru.toNumber(str) // 1
```

---

<a name="toString"></a>
### toString ( x )

Converts a value to a `String`.

__Arguments__

- `x` - A value to convert.

__Example__

```js
var num = 1;
Ru.toString(num) // '1'
```

---

<a name="toDate"></a>
### toDate ( x )

Convert a value to a `Date`.

__Arguments__

- `x` - A value to convert.

__Example__

```js
var str = '1/1/2000';
Ru.toDate(str)  // new Date(str)
```

---

<a name="trace"></a>
### trace ( msg , x )

Logs a message and value and then returns the value.

__Arguments__

- `msg` - A string message to log.
- `x` - A value to log and return.

__Example__

```js
var msg = 'X:';
var fn = R.compose(R.add(1), Ru.trace(msg), R.add(1));

var result = fn(1);   // stdout: 'X: 3'
console.log(result);  // 3
```

---

<a name="zipApply"></a>
### zipApply ( fns , objs )

Zips an array of functions and an array of objects into an array of values produced by applying each object to its respective function.

__Arguments__

- `fns` - An array of functions.
- `objs` - An array of objects.

__Example__

```js
var objs = [{a: 'a'}, {b: 'b'}];
var fns = [(obj) => obj.a, (obj) => obj.b];
Ru.zipApply(fns, objs) // ['a', 'b']
```
