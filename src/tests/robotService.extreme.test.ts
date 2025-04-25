// src/robotService.extreme.test.ts
import { calculateUniquePositions } from '../robotService';
import { StartPosition, Command } from '../types';

describe('Robot Service - Extreme Cases', () => {
  // Test 1: Mange kommandoer med små steg
  test('handles many commands with small steps', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [];

    // Lag et spiralmønster som garantert gir mange unike posisjoner
    // For eksempel: 2 øst, 2 nord, 3 vest, 3 sør, 4 øst, 4 nord, osv.
    let step = 1;
    let direction = 0; // 0: øst, 1: nord, 2: vest, 3: sør

    for (let i = 0; i < 40; i++) {
      const directionName = ['east', 'north', 'west', 'south'][direction] as 'north' | 'east' | 'south' | 'west';
      commands.push({ direction: directionName, steps: step });

      direction = (direction + 1) % 4;
      if (direction === 0 || direction === 2) {
        // Øk antall steg etter hvert par av retninger (øst-nord eller vest-sør)
        step++;
      }
    }

    const result = calculateUniquePositions(start, commands);
    // Med spiralmønsteret bør vi få mange flere unike posisjoner
    expect(result).toBeGreaterThan(250);
  });

  // Test 2: Få kommandoer med mange steg
  test('handles few commands with many steps', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [
      { direction: 'east', steps: 10000 }
    ];

    // Forventer 10001 unike posisjoner (start + 10000 steg)
    expect(calculateUniquePositions(start, commands)).toBe(10001);
  });

  // Test 3: Spiralmønster
  test('handles spiral pattern correctly', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [
      { direction: 'east', steps: 1 },
      { direction: 'north', steps: 1 },
      { direction: 'west', steps: 2 },
      { direction: 'south', steps: 2 },
      { direction: 'east', steps: 3 },
      { direction: 'north', steps: 3 },
      { direction: 'west', steps: 4 },
      { direction: 'south', steps: 4 }
    ];

    // Dette spiralmønsteret gir 21 unike posisjoner
    expect(calculateUniquePositions(start, commands)).toBe(21);
  });

  // Test 4: Koordinater nær grensene
  test('handles coordinates near boundaries', () => {
    const start: StartPosition = { x: 99990, y: 99990 };
    const commands: Command[] = [
      { direction: 'north', steps: 5 },
      { direction: 'east', steps: 5 }
    ];

    // Forventer 11 unike posisjoner
    expect(calculateUniquePositions(start, commands)).toBe(11);
  });

  // Test 5: Zigzag-mønster
  test('handles zigzag pattern correctly', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [];

    // Lag et zigzag-mønster (øst, nord, øst, sør, øst, nord, ...)
    for (let i = 0; i < 10; i++) {
      commands.push({
        direction: 'east',
        steps: 1
      });
      commands.push({
        direction: i % 2 === 0 ? 'north' : 'south',
        steps: 1
      });
    }

    // Dette zigzag-mønsteret gir 21 unike posisjoner
    expect(calculateUniquePositions(start, commands)).toBe(21);
  });

  // Test 6: Repetitiv bevegelse (frem og tilbake)
  test('handles repetitive back-and-forth movement', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [];

    // Gå frem og tilbake 1000 ganger
    for (let i = 0; i < 1000; i++) {
      commands.push({ direction: 'east', steps: 1 });
      commands.push({ direction: 'west', steps: 1 });
    }

    // Kun 2 unike posisjoner: (0,0) og (1,0)
    expect(calculateUniquePositions(start, commands)).toBe(2);
  });

  // Test 7: "Snake"-mønster
  test('handles snake-like pattern correctly', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [];

    // Første rad: gå 5 steg øst
    commands.push({ direction: 'east', steps: 5 });

    // Gå opp ett steg
    commands.push({ direction: 'north', steps: 1 });

    // Andre rad: gå 5 steg vest
    commands.push({ direction: 'west', steps: 5 });

    // Gå opp ett steg
    commands.push({ direction: 'north', steps: 1 });

    // Tredje rad: gå 5 steg øst
    commands.push({ direction: 'east', steps: 5 });

    // Forventer 18 unike posisjoner (6+6+6)
    expect(calculateUniquePositions(start, commands)).toBe(18);
  });

  // Test 8: Ytelsestest for store bevegelser
  test('performance test - handles large movements efficiently', () => {
    const start: StartPosition = { x: 0, y: 0 };
    const commands: Command[] = [
      { direction: 'east', steps: 50000 }
    ];

    const startTime = performance.now();
    const result = calculateUniquePositions(start, commands);
    const endTime = performance.now();

    expect(result).toBe(50001);

    // Sjekk at utførelsen tar mindre enn 500ms
    // Dette må kanskje justeres basert på maskinspesifikasjoner
    expect(endTime - startTime).toBeLessThan(500);
  });
});
