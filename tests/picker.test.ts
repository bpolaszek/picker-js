import { describe, it, expect, beforeEach } from 'vitest';
import { Picker, EmptyPickerError } from '../src/lib/picker';

interface TestItem {
  name: string;
}

describe('Picker', () => {
  describe('with objects', () => {
    let items: TestItem[];
    let weights: WeakMap<TestItem, number>;

    beforeEach(() => {
      items = [
        { name: 'Common' },
        { name: 'Rare' },
        { name: 'Epic' },
        { name: 'Legendary' }
      ];
      
      weights = new WeakMap();
      weights.set(items[0], 100); // Common: very high weight
      weights.set(items[1], 50);  // Rare: high weight
      weights.set(items[2], 20);  // Epic: medium weight
      weights.set(items[3], 5);   // Legendary: low weight
    });

    describe('constructor', () => {
      it('should create a new instance with provided items and options', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights
        });
        expect(picker).toBeInstanceOf(Picker);
      });

      it('should throw error if using Map for objects', () => {
        expect(() => new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: new Map()
        })).toThrow('Must use WeakMap for object values');
      });
    });

    describe('pick', () => {
      it('should return an item from the list', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights
        });
        const picked = picker.pick();
        expect(items).toContain(picked);
      });

      it('should throw EmptyPickerError when list is empty and errorIfEmpty is true', () => {
        const picker = new Picker([], {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: new WeakMap()
        });
        expect(() => picker.pick()).toThrow(EmptyPickerError);
      });

      it('should remove item when shift is true', () => {
        const picker = new Picker([...items], {
          shift: true,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights
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

      it('should respect weights in probability distribution', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights
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

      it('should use defaultWeight when no weight is specified', () => {
        const defaultWeight = 1;
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight,
          weights: new WeakMap() // Empty weights map
        });

        const results = new Map<string, number>();
        const iterations = 1000;

        for (let i = 0; i < iterations; i++) {
          const picked = picker.pick();
          results.set(picked.name, (results.get(picked.name) || 0) + 1);
        }

        // With equal weights, distribution should be roughly even
        const counts = Array.from(results.values());
        const average = counts.reduce((a, b) => a + b) / counts.length;
        const tolerance = iterations * 0.1; // 10% tolerance

        counts.forEach(count => {
          expect(Math.abs(count - average)).toBeLessThan(tolerance);
        });
      });
    });
  });

  describe('with scalars', () => {
    let items: number[];
    let weights: Map<number, number>;

    beforeEach(() => {
      items = [1, 2, 3, 4];
      weights = new Map();
      weights.set(1, 100); // Very high weight
      weights.set(2, 50);  // High weight
      weights.set(3, 20);  // Medium weight
      weights.set(4, 5);   // Low weight
    });

    describe('constructor', () => {
      it('should create a new instance with provided items and options', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights
        });
        expect(picker).toBeInstanceOf(Picker);
      });

      it('should throw error if using WeakMap for scalars', () => {
        expect(() => new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights: new WeakMap()
        })).toThrow('Must use Map for scalar values');
      });
    });

    describe('pick', () => {
      it('should return an item from the list', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights
        });
        const picked = picker.pick();
        expect(items).toContain(picked);
      });

      it('should remove item when shift is true', () => {
        const picker = new Picker([...items], {
          shift: true,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights
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

      it('should respect weights in probability distribution', () => {
        const picker = new Picker(items, {
          shift: false,
          errorIfEmpty: true,
          defaultWeight: 1,
          weights
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
    });
  });
});