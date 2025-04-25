import { StartPosition, Command } from './types';

/**
 * Beregner alle unike posisjoner roboten besøker basert på startposisjon og kommandoer
 * @param start - Robotens startposisjon
 * @param commands - Liste med kommandoer for roboten
 * @returns Antall unike posisjoner roboten har besøkt
 */
export function calculateUniquePositions(start: StartPosition, commands: Command[]): number {
  let x = start.x;
  let y = start.y;

  // Set for å holde styr på unike posisjoner (inkludert startposisjon)
  const uniquePositions = new Set([`${x},${y}`]);

  // Behandle hver kommando
  for (const command of commands) {
    // Bestem retning og antall steg
    const { direction, steps } = command;

    // Utfør bevegelse basert på retning
    for (let i = 0; i < steps; i++) {
      switch (direction) {
        case 'north':
          y += 1;
          break;
        case 'east':
          x += 1;
          break;
        case 'south':
          y -= 1;
          break;
        case 'west':
          x -= 1;
          break;
      }

      // Legg til den nye posisjonen i settet
      uniquePositions.add(`${x},${y}`);
    }
  }

  return uniquePositions.size;
}