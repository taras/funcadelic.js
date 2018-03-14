import chai  from 'chai';
import mocha from 'mocha';
import { propertiesOf } from '../src/utils';

const { expect } = chai;
const { describe, it } = mocha;

describe('propertiesOf', () => {
  it('is stable', () => {
    let obj = { a: 'hello' };
    expect(propertiesOf(obj)).to.equal(propertiesOf(obj));
  });
});