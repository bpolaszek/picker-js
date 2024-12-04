# bentools-picker

A TypeScript library for weighted random item selection with a flexible and intuitive API.

## Features

- 🎲 Weighted random selection
- 🔄 Optional item removal after selection
- ⚡ TypeScript support with full type safety
- 🎯 Configurable default weights
- ⚠️ Customizable empty list handling
- 🧪 Thoroughly tested

## Installation

```bash
npm install bentools-picker
```

## Usage

### Basic Example

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

// Create a WeakMap to store weights
const weights = new WeakMap<Item, number>();
weights.set(items[0], 100);  // Common: very high chance
weights.set(items[1], 50);   // Rare: high chance
weights.set(items[2], 20);   // Epic: medium chance
weights.set(items[3], 5);    // Legendary: low chance

// Initialize the picker
const picker = new Picker(items, {
  shift: false,           // Keep items in the pool after picking
  errorIfEmpty: true,     // Throw error if the list is empty
  defaultWeight: 1,       // Weight for items not in the WeakMap
  weights                 // Our weights WeakMap
});

// Pick a random item
const picked = picker.pick();
console.log(picked.name); // Outputs a random item name based on weights
```

### With Item Removal

```typescript
const consumablePicker = new Picker(items, {
  shift: true,            // Remove items after picking
  errorIfEmpty: true,     // Throw error when all items are consumed
  defaultWeight: 1,
  weights
});

// Each pick removes the item from the pool
while (true) {
  try {
    const item = consumablePicker.pick();
    console.log(`Got: ${item.name}`);
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

- `T extends Object` - The type of items to pick from

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
  weights: WeakMap<T, number>; // Custom weights for items
}
```

#### Methods

##### `pick(): T | never`

Picks a random item based on weights. May throw `EmptyPickerError` if the list is empty and `errorIfEmpty` is true.

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
const items = [
  { name: 'A' },  // weight: 100
  { name: 'B' },  // weight: 50
  { name: 'C' }   // weight: 25
];
```

In this case:
- A has a 57.14% chance (100/175)
- B has a 28.57% chance (50/175)
- C has a 14.29% chance (25/175)

## Best Practices

1. **Memory Management**: Use `WeakMap` for weights to allow garbage collection of removed items.
2. **Error Handling**: Always handle `EmptyPickerError` when `errorIfEmpty` is true.
3. **Weight Distribution**: Use relative weights that make sense for your use case.
4. **Type Safety**: Leverage TypeScript's type system by properly typing your items.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT.