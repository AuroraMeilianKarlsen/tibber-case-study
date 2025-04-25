// Grensesnitt for startposisjon og kommandoer
export interface StartPosition {
  x: number;
  y: number;
}

export interface Command {
  direction: 'north' | 'east' | 'south' | 'west';
  steps: number;
}

export interface RobotRequest {
  start: StartPosition;
  commands: Command[];
}

export interface RobotResponse {
  id: number;
  timestamp: string;
  commands: number;
  result: number;
  duration: number;
}
