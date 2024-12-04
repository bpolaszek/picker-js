var c = Object.defineProperty;
var a = (s, t, e) => t in s ? c(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var n = (s, t, e) => a(s, typeof t != "symbol" ? t + "" : t, e);
class f extends Error {
  constructor() {
    super("Cannot pick from an empty list"), this.name = "EmptyPickerError";
  }
}
function g(s) {
  return typeof s == "object" && s !== null;
}
class p {
  constructor(t, e) {
    n(this, "items");
    n(this, "options");
    n(this, "weights");
    this.items = [...t], this.options = e;
    const r = t.length > 0 && g(t[0]);
    if (this.weights = r ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map(), e.weights) {
      if (Array.isArray(e.weights))
        for (const [i, h] of e.weights)
          r && g(i) ? this.weights.set(i, h) : r || this.weights.set(i, h);
      else if (!r) {
        const i = e.weights;
        for (const h of t) {
          const o = String(h);
          o in i && this.weights.set(h, i[o]);
        }
      }
    }
  }
  getWeight(t) {
    return g(t) ? this.weights.get(t) ?? this.options.defaultWeight : this.weights.get(t) ?? this.options.defaultWeight;
  }
  setWeight(t, e) {
    return g(t) ? this.weights.set(t, e) : this.weights.set(t, e), this;
  }
  calculateTotalWeight() {
    return this.items.reduce((t, e) => t + this.getWeight(e), 0);
  }
  pick() {
    if (this.items.length === 0) {
      if (this.options.errorIfEmpty)
        throw new f();
      return;
    }
    const t = this.calculateTotalWeight();
    let e = Math.random() * t;
    for (let i = 0; i < this.items.length; i++) {
      const h = this.items[i], o = this.getWeight(h);
      if (e <= o)
        return this.options.shift && this.items.splice(i, 1), h;
      e -= o;
    }
    const r = this.items[this.items.length - 1];
    return this.options.shift && this.items.pop(), r;
  }
}
export {
  f as EmptyPickerError,
  p as Picker,
  g as isWeakKeyable
};
