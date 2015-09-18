# ramda-utils

Utilities built on top of Ramda.

[![npm version](https://img.shields.io/npm/v/@panosoft/ramda-utils.svg)](https://www.npmjs.com/package/@panosoft/ramda-utils)
[![npm license](https://img.shields.io/npm/l/@panosoft/ramda-utils.svg)](https://www.npmjs.com/package/@panosoft/ramda-utils)
[![Travis](https://img.shields.io/travis/panosoft/ramda-utils.svg)](https://travis-ci.org/panosoft/ramda-utils)
[![David](https://img.shields.io/david/panosoft/ramda-utils.svg)](https://david-dm.org/panosoft/ramda-utils)
[![npm downloads](https://img.shields.io/npm/dm/@panosoft/ramda-utils.svg)](https://www.npmjs.com/package/@panosoft/ramda-utils)

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
- [`defaults`](#defaults)
- [`filterObj`](#filterObj)
- [`isEmptyC`](#isEmptyC)
- [`isNotEmptyC`](#isNotEmptyC)
- [`matchGroups`](#matchGroups)
- [`pickValues`](#pickValues)
- [`rmap`](#rmap)
- [`subsetOf`](#subsetOf)
- [`sumProps`](#sumProps)
- [`sumColumn`](#sumColumn)
- [`toNumber`](#toNumber)
- [`toString`](#toString)
- [`toDate`](#toDate)
- [`trace`](#trace)
- [`zipApply`](#zipApply)

---

<a name="applyTo"/>
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

<a name="compareProps"/>
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

<a name="complementC"/>
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

<a name="defaults"/>
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

<a name="filterObj"/>
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

<a name="isEmptyC"/>
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

<a name="isNotEmptyC"/>
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

<a name="matchGroups"/>
### matchGroups ( reg , str )

Applies a Regular Expression to a String and returns the matched groups as an array of arrays.

__Arguments__

- `reg` - A regular expression.
- `str` - A string to search.

__Example__

```js
var str = 'abcd abbbd ab___d';
var reg = /ab(.+?)(d)/g;
Ru.matchGroups(reg, str) // [ [ 'c', 'd'], [ 'bb', 'd' ], ['___', 'd'] ]
```

---

<a name="pickValues"/>
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

<a name="rmap"/>
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

<a name="subsetOf"/>
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
Ru.subsetOf(set, sub)     // true;
Ru.subsetOf(set, notSub)) // false;
```

---

<a name="sumProps"/>
### sumProps ( keys , obj )

Returns the sum of the specified properties.

__Arguments__

- `keys` - An array of strings used to determine which properties to sum.
- `obj` - An object containing the specified keys.

__Example__

```js
var obj = {a: 1, b: 2, c: 4};
var keys = ['b', 'c'];
Ru.sumProps(keys, obj)  // 6
```

---

<a name="sumColumn"/>
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

<a name="toNumber"/>
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

<a name="toString"/>
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

<a name="toDate"/>
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

<a name="trace"/>
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

<a name="zipApply"/>
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
