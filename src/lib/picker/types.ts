/**
 * Type for items that can be used as keys in a WeakMap (objects)
 */
type WeakKeyable = object

/**
 * Type guard to check if a value can be used as a key in a WeakMap
 */
export function isWeakKeyable(value: unknown): value is WeakKeyable {
  return typeof value === 'object' && value !== null
}

/**
 * Weights container that automatically uses WeakMap for objects and Map for scalars
 */
export type WeightsContainer<T> = T extends WeakKeyable ? WeakMap<T, Weight> : Map<T, Weight>

export type Weight = number

export interface PickerOptions<T> {
  shift: boolean
  errorIfEmpty: boolean
  defaultWeight: Weight
  weights: WeightsContainer<T>
}

export interface IPicker<T> {
  pick(): T | never
}
