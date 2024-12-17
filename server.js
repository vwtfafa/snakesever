const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

let leaderboard = [
    { name: "Player1", score: 100 },
    { name: "Player2", score: 90 },
    { name: "Player3", score: 80 },
    // Top 10 Spieler, maximal 10 Einträge
];

// Alle Punktzahlen abrufen (Top 10)
app.get("/leaderboard", (req, res) => {
    res.json(leaderboard.slice(0, 10));  // Nur die Top 10 zurückgeben
});

// Punktzahl hinzufügen
app.post("/leaderboard", (req, res) => {
    const { name, score } = req.body;
    if (!name || !score) {
        return res.status(400).send("Name und Score sind erforderlich");
    }

    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);  // Sortiere die Bestenliste absteigend
    leaderboard = leaderboard.slice(0, 10);  // Stelle sicher, dass es nur 10 Einträge gibt
    res.json({ message: "Punktzahl gespeichert" });
});

// Punktzahl entfernen
app.delete("/leaderboard", (req, res) => {
    const { name } = req.body;
    leaderboard = leaderboard.filter(entry => entry.name !== name);
    res.json({ message: `Punktzahl für ${name} entfernt` });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
