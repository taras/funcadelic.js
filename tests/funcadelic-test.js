import { map, append, foldr, foldl, filter, pure, reduce, Monoid } from '../src/funcadelic';
import chai  from 'chai';
import mocha from 'mocha';

const { expect } = chai;
const { describe, it } = mocha;

function promise(result) {
  return Promise.resolve(result);
}


describe('Functor', function() {
  it('maps objects', function() {
    expect(map((i) => i * 2, {one: 1, two: 2})).to.deep.equal({one: 2, two: 4});
  });
  it('maps arrays', function() {
    expect(map(i => i * 2, [1, 2, 3])).to.deep.equal([2,4,6]);
  });
  it('maps promises', function() {
    return map(i => i * 2, promise(5)).then((result) => {
      expect(result).to.equal(10);
    });
  });
  it('passes the key to the mapping function for objects', function() {
    expect(map((_, name) => `hello ${name}`, {one: 1, two: 2})).to.deep.equal({one: 'hello one', two: 'hello two'});
  });
});

describe('Semigroup', function() {
  it('appends objects', function() {
    expect(append({one: 1, two: 2}, {two: 'two', three: 3})).to.deep.equal({one: 1, two: 'two', three: 3});
  });
  it('appends arrays', function() {
    expect(append([1,2,3], [4,4,4])).to.deep.equal([1,2,3,4,4,4]);
  });
  it('maintains prototype', function() {
    class OneAndTwo {
      constructor() {
        this.one = 1;
        this.two = 2;
      }
    }
    expect(append(new OneAndTwo(), { two: 'two', three: 3 })).to.be.instanceof(OneAndTwo);
  });
});

describe('Monoid', function () {
  it('reduces arrays', function() {
    expect(reduce(Array, [[1,2,3], [4,5,6]])).to.deep.equal([1,2,3,4,5,6]);
  });
  it('reduces objects', function() {
    expect(reduce(Object, [{first: 'Charles'}, {last: 'Lowell'}])).to.deep.equal({first: 'Charles', last: 'Lowell'});
  });

  let Sum = Monoid.create(class Sum {
    empty() { return 0; }
    append(a, b) {
      return a + b;
    }
  });

  it('Allows you to define one-off monoids for convenience', function() {
    expect(Sum.reduce([1,2,3,4])).to.equal(10);
  });

  it('Same monoid can be used for an array and an objects', function() {
    expect(Sum.reduce({"a": 1, "b": 2, "c": 3, "d": 4})).to.equal(10);
  });

});

describe('Foldable', function() {
  it('folds arrays', function() {
    expect(foldr((sum, i) => sum + i, 0, [1,2,3,4])).to.equal(10);
    expect(foldl((sum, i) => sum + i, 0, [1,2,3,4])).to.equal(10);
  });
  it('folds objects', function() {
    expect(foldl((reverse, entry) => append(reverse, {[entry.value]: entry.key}), {}, {
      one: 'won',
      two: 'two'
    })).to.deep.equal({won: 'one', two: 'two'});
    expect(foldr((reverse, { key, value }) => append(reverse, {[value]: key}), {}, {
      one: 'won',
      two: 'two'
    })).to.deep.equal({won: 'one', two: 'two'});
  });
});

describe('Filterable', function() {
  it('filters arrays', function() {
    expect(filter(x => x > 5, [10,3,10, 5])).to.deep.equal([10,10]);
  });
  it('filters objects', function() {
    expect(filter(({key}) => key !== 'nope', {yes: 1, yep: 2, nope: 3, yup: 4}))
      .to.deep.equal({yes: 1, yep: 2, yup: 4});
  });
});


import { apply } from '../src/funcadelic';

describe('Applicative', function() {
  it('applies to promises', function() {
    let greeting = (say, to, isExcited) => `${say}, ${to}${isExcited ? '!!' : ''}`;

    return apply(Promise, greeting, [promise('Hello'), promise('World'), promise(true)])
      .then(result => expect(result).to.equal('Hello, World!!'));
  });
  it('can invoke pure statically', function() {
    return pure(Promise, "now I'm in a promise").then(msg => {
      expect(msg).to.equal("now I'm in a promise");
    });
  });
});


import { Functor } from '../src/funcadelic';

describe('A Typeclass', function () {
  it('has an associated symbol', function() {
    expect(Functor.symbol).not.to.be.undefined;
    expect(Object.getOwnPropertySymbols(Object.prototype)).to.include(Functor.symbol);
  });
});
