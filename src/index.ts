import express, { Request, Response } from 'express';
import { RobotRequest, RobotResponse } from './types';
import { calculateUniquePositions } from './robotService';

// Opprett Express app
const app = express();
app.use(express.json());


// GET-endepunkt for /hello-world (beholder dette for testing)
app.get('/hello-world', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});


// Definer POST endepunktet
app.post('/tibber-developer-test/enter-path', (req: Request, res: Response) => {
  const robotRequest = req.body as RobotRequest;

  // Mål hvor lang tid beregningen tar
  const startTime = process.hrtime();

  // Beregn antall unike posisjoner
  const uniquePositions = calculateUniquePositions(robotRequest.start, robotRequest.commands);

  // Beregn tiden det tok (i sekunder)
  const endTime = process.hrtime(startTime);
  const duration = endTime[0] + endTime[1] / 1e9;

  // Lag respons
  const response: RobotResponse = {
    id: Math.floor(Math.random() * 10000), // Tilfeldig ID for nå
    timestamp: new Date().toISOString(),
    commands: robotRequest.commands.length,
    result: uniquePositions,
    duration: duration
  };

  // Returner svaret som JSON
  res.json(response);
});

// Start serveren
const PORT = 3000; //5000 er allerede i bruk
app.listen(PORT, () => {
  console.log(`Server kjører på port ${PORT}`);
});
