/**
 * Turns any single argument function into function that caches its
 * result. The reference to the cache key is held weakly, so if the
 * argument is ever garbage collected, the result can also be garbage
 * (assuming there are no other references to it held elswhere).
 *
 * Example:
 *   const capitalizeKeys = caching(function(object) {
 *     return foldl((result, {key, value}) => append(result, {[key.capitalize()]: value}) {},object);
 *   });
 *   let value = {foo: 'bar', baz: 'bang'};
 *   capitalizeKeys(value) === capitalizeKeys(value) //=> true
 *
 * Note: Primitive values cannot be used as weakmap keys, and so
 * results will not be cached for primitive arguments.
 */
export default function stable(fn) {
  switch (fn.length) {
  case 0:
    return stableOne(function(a) { return fn(); });
  case 1:
    return stableOne(fn);
  case 2:
    return stableTwo(fn);
  case 3:
    return stableThree(fn);
  default:
    throw new Error('Cannot make functions greater than arity 3 stable');
  }
}

export function stableOne(fn) {
  let cache = new WeakMap();
  return function(argument) {
    switch (typeof argument) {
    case "number":
    case "string":
      return fn(argument);
    default:
      let key = keyFor(argument);
      if (cache.has(key)) {
        return cache.get(key);
      } else {
        let result = fn(argument);
        cache.set(key, result);
        return result;
      }
    };
  };
}

function stableTwo(fn) {
  function first(a) {
    return stableOne(function second(b) {
      return fn(a, b);
    });
  }
  let stableFirst = stableOne(first);

  return function stablelized(a, b) {
    return stableFirst(a)(b);
  };
}

function stableThree(fn) {
  function first(a) {
    return stableTwo(function second(b, c) {
      return fn(a, b, c);
    });
  }
  let start = stableOne(first);
  return function stableized(a, b, c) {
    return start(a)(b, c);
  };
}

const UNDEF_KEY = {};
const NULL_KEY = {};
const TRUE_KEY = {};
const FALSE_KEY = {};

function keyFor(value) {
  if (value === undefined) {
    return UNDEF_KEY;
  } else if (value === null) {
    return NULL_KEY;
  } else if (value === true) {
    return TRUE_KEY;
  } else if (value === false) {
    return FALSE_KEY;
  } else {
    return value;
  }
}
