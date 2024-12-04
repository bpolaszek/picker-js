import { IPicker, PickerOptions, Weight } from './types';
export declare class Picker<T> implements IPicker<T> {
    private items;
    private options;
    private weights;
    constructor(items: T[], options: PickerOptions<T>);
    getWeight(item: T): Weight;
    setWeight(item: T, weight: Weight): this;
    private calculateTotalWeight;
    pick(): T | undefined;
}
