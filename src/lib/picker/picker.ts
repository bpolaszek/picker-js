import {EmptyPickerError} from './errors'
import {IPicker, PickerOptions, Weight, isWeakKeyable} from './types'

export class Picker<T> implements IPicker<T> {
  private items: T[]
  private options: PickerOptions<T>
  private weights: WeakMap<object, Weight> | Map<T, Weight>

  constructor(items: T[], options: PickerOptions<T>) {
    this.items = [...items] // Create a copy to avoid modifying the original array
    this.options = options

    // Initialize the appropriate Map type based on the first item
    const shouldUseWeakMap = items.length > 0 && isWeakKeyable(items[0])
    this.weights = shouldUseWeakMap ? new WeakMap() : new Map()

    // Initialize weights from user-provided weights if any
    if (options.weights) {
      if (Array.isArray(options.weights)) {
        // Handle array of tuples
        for (const [item, weight] of options.weights) {
          if (shouldUseWeakMap && isWeakKeyable(item)) {
            ;(this.weights as WeakMap<object, Weight>).set(item, weight)
          } else if (!shouldUseWeakMap) {
            ;(this.weights as Map<T, Weight>).set(item, weight)
          }
        }
      } else if (!shouldUseWeakMap) {
        // Handle record object (only for non-object values)
        const recordWeights = options.weights as Record<string | number, Weight>
        for (const item of items) {
          const key = String(item)
          if (key in recordWeights) {
            ;(this.weights as Map<T, Weight>).set(item, recordWeights[key])
          }
        }
      }
    }
  }

  public getWeight(item: T): Weight {
    if (isWeakKeyable(item)) {
      return (this.weights as WeakMap<object, Weight>).get(item) ?? this.options.defaultWeight
    }
    return (this.weights as Map<T, Weight>).get(item) ?? this.options.defaultWeight
  }

  public setWeight(item: T, weight: Weight): this {
    if (isWeakKeyable(item)) {
      ;(this.weights as WeakMap<object, Weight>).set(item, weight)
    } else {
      ;(this.weights as Map<T, Weight>).set(item, weight)
    }
    return this
  }

  private calculateTotalWeight(): number {
    return this.items.reduce((sum, item) => sum + this.getWeight(item), 0)
  }

  public pick(): T | undefined {
    if (this.items.length === 0) {
      if (this.options.errorIfEmpty) {
        throw new EmptyPickerError()
      }
      return undefined
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
