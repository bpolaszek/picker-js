import {EmptyPickerError} from './errors'
import {IPicker, PickerOptions, Weight} from './types'

export class Picker<T extends Object> implements IPicker<T> {
  private items: T[]
  private options: PickerOptions<T>

  constructor(items: T[], options: PickerOptions<T>) {
    this.items = [...items] // Create a copy to avoid modifying the original array
    this.options = options
  }

  private getWeight(item: T): Weight {
    return this.options.weights.get(item) ?? this.options.defaultWeight
  }

  private calculateTotalWeight(): number {
    return this.items.reduce((sum, item) => sum + this.getWeight(item), 0)
  }

  public pick(): T | never {
    if (this.items.length === 0) {
      if (this.options.errorIfEmpty) {
        throw new EmptyPickerError()
      }
      return undefined as never
    }

    const totalWeight = this.calculateTotalWeight()
    let random = Math.random() * totalWeight

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const weight = this.getWeight(item)

      if (random <= weight) {
        if (this.options.shift) {
          this.items.splice(i, 1)
        }
        return item
      }

      random -= weight
    }

    // Fallback to last item (to handle floating-point precision issues)
    const lastItem = this.items[this.items.length - 1]
    if (this.options.shift) {
      this.items.pop()
    }
    return lastItem
  }
}
