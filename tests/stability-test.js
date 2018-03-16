import chai from "chai";
import mocha from "mocha";
import { propertiesOf } from "../src/utils";
import { append } from "../src/funcadelic";

const { expect } = chai;
const { describe, it } = mocha;

describe("stability", () => {
  it("propertiesOf is stable", () => {
    let obj = { a: "hello" };
    expect(propertiesOf(obj)).to.equal(propertiesOf(obj));
  });
  it("append is stable when appending plain objects", () => {
    let target = { a: "a" };
    let props = { b: "b" };
    expect(append(target, props)).to.equal(append(target, props));
  });

  it("append is stable when appending instances", () => {
    let target = new class Person {}();
    let props = { name: "Taras" };
    expect(append(target, props)).to.equal(append(target, props));
  });
});
