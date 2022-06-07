import { flattenKeys, prefixKeys } from "../utils";

describe("flattenKeys", () => {
  it("does nothing to object with depth one", () => {
    const o = {
      a: "a",
      b: "b",
      c: "c",
      d: "d",
    };

    expect(flattenKeys(o)).toEqual(o);
  });

  it("flattens keys on object with depth 2", () => {
    const o = {
      a: "a",
      b: {
        c: "c",
        d: "d",
      },
      e: "e",
    };

    expect(flattenKeys(o)).toEqual({
      a: "a",
      "b.c": "c",
      "b.d": "d",
      e: "e",
    });
  });

  it("flattens keys on object with depth 3", () => {
    const o = {
      a: "a",
      b: {
        c: "c",
        d: {
          e: "e",
          f: "f",
        },
      },
    };

    expect(flattenKeys(o)).toEqual({
      a: "a",
      "b.c": "c",
      "b.d.e": "e",
      "b.d.f": "f",
    });
  });

  it("flattens keys on object with depth 4", () => {
    const o = {
      a: "a",
      b: {
        c: "c",
        d: {
          e: "e",
          f: {
            g: "g",
            h: "h",
          },
        },
      },
    };

    expect(flattenKeys(o)).toEqual({
      a: "a",
      "b.c": "c",
      "b.d.e": "e",
      "b.d.f.g": "g",
      "b.d.f.h": "h",
    });
  });

  it("flattens object with empty object as value", () => {
    const o = {
      a: {
        b: "b",
        c: {},
      }
    };

    expect(flattenKeys(o)).toEqual({
      "a.b": "b",
      "a.c": {},
    });
  });

  it("flattens object with many different types", () => {
    const o = {
      a: 1,
      b: {
        c: [{ test: "test" }],
        d: {
          e: [],
          f: {
            g: undefined,
            h: 100,
          },
        },
      },
      i: {
        j: {},
        k: null,
      },
    };

    expect(flattenKeys(o)).toEqual({
      a: 1,
      "b.c": [{ test: "test" }],
      "b.d.e": [],
      "b.d.f.g": undefined,
      "b.d.f.h": 100,
      "i.j": {},
      "i.k": null,
    });
  });
});

describe("prefixKeys", () => {
  it("prefixes keys in simple object", () => {
    const o = {
      a: "a",
      b: 1,
      c: null,
      d: [],
      e: {},
    };

    expect(prefixKeys(o, "prefix-")).toEqual({
      "prefix-a": "a",
      "prefix-b": 1,
      "prefix-c": null,
      "prefix-d": [],
      "prefix-e": {},
    });
  });

  it("does nothing for empty prefix", () => {
    const o = {
      0: "test",
      b: 1,
      key: null,
    };

    expect(prefixKeys(o, "")).toEqual({
      0: "test",
      b: 1,
      key: null,
    });
  });

  it("works with numeric keys", () => {
    const o = {
      0: "a",
      1: "b",
      2: "c",
    };

    expect(prefixKeys(o, "key-")).toEqual({
      "key-0": "a",
      "key-1": "b",
      "key-2": "c",
    });
  });

  it("works with function members", () => {
    const o = {
      test1() {
        return "test1";
      },
      test2() {
        return "test2";
      },
    };

    expect(prefixKeys(o, "key-")["key-test1"]()).toEqual("test1");
  });

  it("works with Symbol.asyncIterator", () => {
    const o = {
      async *[Symbol.asyncIterator]() {},
      a: "a",
    };

    expect(prefixKeys(o, "key-")).toEqual({
      "key-a": "a",
    });
  });
});
