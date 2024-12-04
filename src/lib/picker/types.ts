export type Weight = number

export interface PickerOptions<T extends Object> {
  shift: boolean
  errorIfEmpty: boolean
  defaultWeight: Weight
  weights: WeakMap<T, Weight>
}

export interface IPicker<T extends Object> {
  pick(): T | never
}
