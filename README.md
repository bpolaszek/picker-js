# bentools-picker

A TypeScript library for weighted random item selection with a flexible and intuitive API.

## Features

- 🎲 Weighted random selection
- 🔄 Optional item removal after selection
- ⚡ TypeScript support with full type safety
- 🎯 Configurable default weights
- ⚠️ Customizable empty list handling
- 🧪 Thoroughly tested
- 📦 Support for both scalar and object values

## Installation

```bash
npm install bentools-picker
```

## Usage

```typescript
import { Picker } from 'bentools-picker';

interface Item {
  name: string;
}

const items = [
  { name: 'Common' },
  { name: 'Rare' },
  { name: 'Epic' },
  { name: 'Legendary' }
];

const names = [
    'Common',
    'Rare',
    'Epic',
    'Legendary',
];

// Method 1: Using array of tuples
const picker1 = new Picker(items, {
  shift: false,
  errorIfEmpty: true,
  defaultWeight: 1,
  weights: [
    [items[0], 100],  // Common: very high chance
    [items[1], 50],   // Rare: high chance
    [items[2], 20],   // Epic: medium chance
    [items[3], 5]     // Legendary: low chance
  ]
});

// Method 2: Using a record object (only works with scalars)
const picker2 = new Picker(names, {
  shift: false,
  errorIfEmpty: true,
  defaultWeight: 1,
  weights: {
    'Common': 100,  // Common: very high chance
    'Rare': 50,   // Rare: high chance
    'Epic': 20,   // Epic: medium chance
    'Legendary': 5     // Legendary: low chance
  }
});

// Method 3: Set weights after initialization
const picker3 = new Picker(items, {
  shift: false,
  errorIfEmpty: true,
  defaultWeight: 1
})
  .setWeight(items[0], 100)
  .setWeight(items[1], 50)
  .setWeight(items[2], 20)
  .setWeight(items[3], 5);

// Pick a random item
const picked = picker3.pick();
console.log(picked.name); // Outputs a random item name based on weights
```

### With Item Removal

```typescript
const consumablePicker = new Picker(items, {
  shift: true,            // Remove items after picking
  errorIfEmpty: true,     // Throw error when all items are consumed
  defaultWeight: 1,
  weights: [
    [1, 100],  // Very high chance
    [2, 50],   // High chance
    [3, 20],   // Medium chance
    [4, 5]     // Low chance
  ]
});

// Each pick removes the item from the pool
while (true) {
  try {
    const item = consumablePicker.pick();
    console.log(`Got: ${item}`);
  } catch (error) {
    if (error instanceof EmptyPickerError) {
      console.log('No more items to pick!');
      break;
    }
    throw error;
  }
}
```

## API Reference

### `Picker<T>`

The main class for weighted random selection.

#### Type Parameters

- `T` - The type of items to pick from. Can be either a scalar (number, string, etc.) or an object type.

#### Constructor

```typescript
constructor(items: T[], options: PickerOptions<T>)
```

#### Options

```typescript
interface PickerOptions<T> {
  shift: boolean;         // Remove picked items from the pool
  errorIfEmpty: boolean;  // Throw error on empty list
  defaultWeight: number;  // Default weight for items
  weights?: Weights<T>;   // Optional weights definition (array of tuples or record object)
}

type Weights<T> = Array<[T, Weight]> | Record<string | number, Weight>;
```

#### Methods

##### `pick(): T | never`

Picks a random item based on weights. May throw `EmptyPickerError` if the list is empty and `errorIfEmpty` is true.

##### `setWeight(item: T, weight: number): this`

Sets the weight for a specific item. Returns the picker instance for method chaining.

```typescript
// Set weights individually
picker.setWeight(items[0], 100);

// Or chain multiple calls
picker
  .setWeight(items[0], 100)
  .setWeight(items[1], 50)
  .setWeight(items[2], 20);
```

### Errors

#### `EmptyPickerError`

Thrown when attempting to pick from an empty list with `errorIfEmpty: true`.

```typescript
try {
  picker.pick();
} catch (error) {
  if (error instanceof EmptyPickerError) {
    // Handle empty list
  }
}
```

## How Weights Work

The probability of an item being picked is proportional to its weight relative to the sum of all weights. For example:

```typescript
const items = [1, 2, 3];  // weights: 100, 50, 25
```

In this case:
- 1 has a 57.14% chance (100/175)
- 2 has a 28.57% chance (50/175)
- 3 has a 14.29% chance (25/175)

## Best Practices

1. **Memory Management**: The library automatically uses `WeakMap` for objects and `Map` for scalar values internally.
2. **Weight Formats**: Choose the most convenient weight format for your use case:
   - Array of tuples: Best for type safety and IDE support
   - Record object: Best for configuration files (remember to use `JSON.stringify` for object keys)
   - `setWeight` method: Best for dynamic weight updates
3. **Error Handling**: Always handle `EmptyPickerError` when `errorIfEmpty` is true.
4. **Weight Distribution**: Use relative weights that make sense for your use case.
5. **Type Safety**: Leverage TypeScript's type system by properly typing your items.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT.
