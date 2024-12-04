/**
 * Type for items that can be used as keys in a WeakMap (objects)
 */
type WeakKeyable = object;
/**
 * Type guard to check if a value can be used as a key in a WeakMap
 */
export declare function isWeakKeyable(value: unknown): value is WeakKeyable;
export type Weight = number;
/**
 * User-provided weights definition.
 * For object values (T extends object), only array of tuples is supported.
 * For scalar values, both array of tuples and record objects are supported.
 */
export type Weights<T> = Array<[T, Weight]> | (T extends WeakKeyable ? never : Record<string | number, Weight>);
export interface PickerOptions<T> {
    /** If true, items will be removed from the pool after being picked */
    shift: boolean;
    /** If true, picking from an empty pool will throw EmptyPickerError */
    errorIfEmpty: boolean;
    /** Default weight for items that don't have a specific weight set */
    defaultWeight: Weight;
    /** Optional weights definition. For objects, use array of tuples. For scalars, use either array of tuples or record object */
    weights?: Weights<T>;
}
export type PickerConstructorOptions<T> = Partial<PickerOptions<T>>;
export interface IPicker<T> {
    /** Pick a random item based on weights. Returns undefined if pool is empty and errorIfEmpty is false */
    pick(): T | undefined;
    /** Set weight for a specific item. Returns this for method chaining */
    setWeight(item: T, weight: Weight): this;
    /** Get the weight of a specific item. Returns defaultWeight if no weight is set */
    getWeight(item: T): Weight;
}
export {};
