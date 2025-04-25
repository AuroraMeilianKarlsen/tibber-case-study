import { calculateUniquePositions } from '../robotService';
import { StartPosition, Command } from '../types';

describe('Robot Service', () => {
  // Test 1: Kun startposisjon
  test('returns 1 for just the starting position with no commands', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [];

    expect(calculateUniquePositions(start, commands)).toBe(1);
  });

  // Test 2: Eksempelet fra oppgavebeskrivelsen
  test('calculates the example from task description correctly', () => {
    const start: StartPosition = { x: 10, y: 22 };
    const commands: Command[] = [
      { direction: 'east', steps: 2 },
      { direction: 'north', steps: 1 }
    ];

    // Forventet: Start + 2 øst + 1 nord = 4 unike posisjoner
    expect(calculateUniquePositions(start, commands)).toBe(4);
  });

  // Test 3: Bevegelse i alle retninger
  test('handles movement in all directions', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [
      { direction: 'north', steps: 2 },
      { direction: 'east', steps: 2 },
      { direction: 'south', steps: 2 },
      { direction: 'west', steps: 2 }
    ];

    // Dette lager en "firkant" med 8 unike posisjoner (ikke inkludert startpunktet)
    expect(calculateUniquePositions(start, commands)).toBe(8);
  });

  // Test 4: Overlappende posisjoner
  test('counts overlapping positions only once', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [
      { direction: 'north', steps: 2 },
      { direction: 'south', steps: 2 },
      { direction: 'north', steps: 1 }
    ];

    // Posisjoner: (0,0) -> (0,1) -> (0,2) -> (0,1) -> (0,0) -> (0,1)
    // Unike: (0,0), (0,1), (0,2) = 3 posisjoner
    expect(calculateUniquePositions(start, commands)).toBe(3);
  });

  // Test 5: Negative koordinater
  test('handles negative coordinates correctly', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [
      { direction: 'south', steps: 3 },
      { direction: 'west', steps: 2 }
    ];

    // (0,0) + 3 sør + 2 vest = 6 unike posisjoner
    expect(calculateUniquePositions(start, commands)).toBe(6);
  });

  // Test 6: Stort antall steg
  test('handles large number of steps correctly', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [
      { direction: 'east', steps: 1000 }
    ];

    // Start + 1000 steg øst = 1001 unike posisjoner
    expect(calculateUniquePositions(start, commands)).toBe(1001);
  });
});
