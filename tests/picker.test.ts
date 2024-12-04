import { describe, it, expect, beforeEach } from 'vitest';
import { Picker, EmptyPickerError } from '../src/lib/picker';

interface TestItem {
  name: string;
}

describe('Picker', () => {
  describe('with objects', () => {
    let items: TestItem[];

    beforeEach(() => {
      items = [
        { name: 'Common' },
        { name: 'Rare' },
        { name: 'Epic' },
        { name: 'Legendary' }
      ];
    });

    describe('constructor', () => {
      it('should create a new instance with array weights', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: [
            [items[0], 100],
            [items[1], 50],
            [items[2], 20],
            [items[3], 5]
          ]
        });
        expect(picker).toBeInstanceOf(Picker);
      });

      it('should create a new instance without weights', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1
        });
        expect(picker).toBeInstanceOf(Picker);
      });
    });

    describe('pick', () => {
      it('should return an item from the list', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: [
            [items[0], 100],
            [items[1], 50],
            [items[2], 20],
            [items[3], 5]
          ]
        });
        const picked = picker.pick();
        expect(items).toContain(picked);
      });

      it('should throw EmptyPickerError when list is empty and errorIfEmpty is true', () => {
        const picker = new Picker([], {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1
        });
        expect(() => picker.pick()).toThrow(EmptyPickerError);
      });

      it('should remove item when shift is true', () => {
        const picker = new Picker([...items], {
          shift: true,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: [
            [items[0], 100],
            [items[1], 50],
            [items[2], 20],
            [items[3], 5]
          ]
        });

        const initialLength = items.length;
        picker.pick();

        // We need to pick again to verify the item was removed
        const remainingItems = new Set();
        for (let i = 0; i < initialLength - 1; i++) {
          remainingItems.add(picker.pick());
        }

        expect(remainingItems.size).toBe(initialLength - 1);
      });

      it('should respect weights in probability distribution with provided weights', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: [
            [items[0], 100],
            [items[1], 50],
            [items[2], 20],
            [items[3], 5]
          ]
        });

        const results = new Map<string, number>();
        const iterations = 10000;

        // Perform many picks to test probability distribution
        for (let i = 0; i < iterations; i++) {
          const picked = picker.pick();
          results.set(picked.name, (results.get(picked.name) || 0) + 1);
        }

        // Common item should be picked more often than Legendary
        expect(results.get('Common')! > results.get('Legendary')!).toBe(true);
        expect(results.get('Rare')! > results.get('Epic')!).toBe(true);
      });

      it('should allow setting weights after initialization', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1
        });

        // Set weights using method chaining
        picker
          .setWeight(items[0], 100)
          .setWeight(items[1], 50)
          .setWeight(items[2], 20)
          .setWeight(items[3], 5);

        const results = new Map<string, number>();
        const iterations = 10000;

        for (let i = 0; i < iterations; i++) {
          const picked = picker.pick();
          results.set(picked.name, (results.get(picked.name) || 0) + 1);
        }

        // Common item should be picked more often than Legendary
        expect(results.get('Common')! > results.get('Legendary')!).toBe(true);
        expect(results.get('Rare')! > results.get('Epic')!).toBe(true);
      });
    });
  });

  describe('with scalars', () => {
    let items: number[];

    beforeEach(() => {
      items = [1, 2, 3, 4];
    });

    describe('constructor', () => {
      it('should create a new instance with array weights', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: [
            [1, 100],
            [2, 50],
            [3, 20],
            [4, 5]
          ]
        });
        expect(picker).toBeInstanceOf(Picker);
      });

      it('should create a new instance with record weights', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: {
            1: 100,
            2: 50,
            3: 20,
            4: 5
          }
        });
        expect(picker).toBeInstanceOf(Picker);
      });
    });

    describe('pick', () => {
      it('should return an item from the list', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: [
            [1, 100],
            [2, 50],
            [3, 20],
            [4, 5]
          ]
        });
        const picked = picker.pick();
        expect(items).toContain(picked);
      });

      it('should remove item when shift is true', () => {
        const picker = new Picker([...items], {
          shift: true,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: [
            [1, 100],
            [2, 50],
            [3, 20],
            [4, 5]
          ]
        });

        const initialLength = items.length;
        picker.pick();

        // We need to pick again to verify the item was removed
        const remainingItems = new Set();
        for (let i = 0; i < initialLength - 1; i++) {
          remainingItems.add(picker.pick());
        }

        expect(remainingItems.size).toBe(initialLength - 1);
      });

      it('should respect weights in probability distribution with array weights', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: [
            [1, 100],
            [2, 50],
            [3, 20],
            [4, 5]
          ]
        });

        const results = new Map<number, number>();
        const iterations = 10000;

        // Perform many picks to test probability distribution
        for (let i = 0; i < iterations; i++) {
          const picked = picker.pick();
          results.set(picked, (results.get(picked) || 0) + 1);
        }

        // Higher weighted items should be picked more often
        expect(results.get(1)! > results.get(4)!).toBe(true);
        expect(results.get(2)! > results.get(3)!).toBe(true);
      });

      it('should respect weights in probability distribution with record weights', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: {
            1: 100,
            2: 50,
            3: 20,
            4: 5
          }
        });

        const results = new Map<number, number>();
        const iterations = 10000;

        // Perform many picks to test probability distribution
        for (let i = 0; i < iterations; i++) {
          const picked = picker.pick();
          results.set(picked, (results.get(picked) || 0) + 1);
        }

        // Higher weighted items should be picked more often
        expect(results.get(1)! > results.get(4)!).toBe(true);
        expect(results.get(2)! > results.get(3)!).toBe(true);
      });

      it('should allow setting weights after initialization', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1
        });

        // Set weights using method chaining
        picker
          .setWeight(1, 100)
          .setWeight(2, 50)
          .setWeight(3, 20)
          .setWeight(4, 5);

        const results = new Map<number, number>();
        const iterations = 10000;

        for (let i = 0; i < iterations; i++) {
          const picked = picker.pick();
          results.set(picked, (results.get(picked) || 0) + 1);
        }

        // Higher weighted items should be picked more often
        expect(results.get(1)! > results.get(4)!).toBe(true);
        expect(results.get(2)! > results.get(3)!).toBe(true);
      });
    });
  });
});
