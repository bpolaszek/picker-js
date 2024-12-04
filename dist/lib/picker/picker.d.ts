import { IPicker, PickerConstructorOptions, Weight } from './types';
export declare class Picker<T> implements IPicker<T> {
    private items;
    private options;
    private weights;
    constructor(items: T[], options?: PickerConstructorOptions<T>);
    getWeight(item: T): Weight;
    setWeight(item: T, weight: Weight): this;
    private calculateTotalWeight;
    pick(): T | undefined;
}
