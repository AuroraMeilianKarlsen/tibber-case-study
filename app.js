const express = require('express');
const app = express();
const port = 3000; // 5000 er allerede i bruk

// Middleware for å håndtere JSON-data
app.use(express.json());

// GET-endepunkt for /hello-world (beholder dette for testing)
app.get('/hello-world', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Funksjon for å beregne robotens sluttposisjon og unikt besøkte posisjoner
function calculateRobotPath(startX, startY, commands) {
  // Startposisjon
  let x = startX;
  let y = startY;
  
  // Retning: 0 = Nord, 1 = Øst, 2 = Sør, 3 = Vest
  let direction = 0; //Nord er default
  
  // Set for å holde styr på unike posisjoner (inkludert startposisjon)
  const uniquePositions = new Set([`${x},${y}`]);
  
  // Behandle hver kommando (F for forward, L for roter mot left, R for roter mot right)
  for (const command of commands) {
    if (command === 'F') {
      // Beveg fremover basert på nåværende retning
      switch (direction) {
        case 0: // Nord
          y += 1;
          break;
        case 1: // Øst
          x += 1;
          break;
        case 2: // Sør
          y -= 1;
          break;
        case 3: // Vest
          x -= 1;
          break;
      }
      
      // Legg til den nye posisjonen i settet
      uniquePositions.add(`${x},${y}`);
    } else if (command === 'L') {
      // Snu 90 grader mot venstre
      direction = (direction + 3) % 4;
    } else if (command === 'R') {
      // Snu 90 grader mot høyre
      direction = (direction + 1) % 4;
    }
  }
  
  return {
    finalX: x,
    finalY: y,
    uniquePositions: uniquePositions.size
  };
}

// POST-endepunkt for /tibber-developer-test/enter-path
app.post('/tibber-developer-test/enter-path', (req, res) => {
  // Registrer starttidspunkt for å måle varighet
  const startTime = process.hrtime();
  
  const startPosition = req.body.start;
  const commands = req.body.commands;
  
  // Valider input
  if (!startPosition || !Array.isArray(commands)) {
    return res.status(400).json({ error: 'Ugyldig input. Forventer start-posisjon og kommandoer.' });
  }
  
  // Beregn robotens sti
  const result = calculateRobotPath(startPosition.x, startPosition.y, commands);
  
  // Beregn varighet (i sekunder)
  const endTime = process.hrtime(startTime);
  const duration = endTime[0] + endTime[1] / 1e9;
  
  // Bygg responsdata
  const responseData = {
    id: Date.now(), // Bruk timestamp som ID for enkelhetens skyld
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
    commands: commands.length,
    result: result.uniquePositions,
    duration: duration
  };
  
  res.json(responseData);
});

// GET-endepunkt for å teste i nettleseren
app.get('/tibber-developer-test/enter-path', (req, res) => {
  res.json({ message: "Dette er et POST-endepunkt. Bruk en POST-forespørsel med JSON-data for å teste." });
});

// Start serveren
app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});