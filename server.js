const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Pfad zur JSON-Datei
const leaderboardFile = "./leaderboard.json";

// Hilfsfunktion: Bestenliste lesen
function readLeaderboard() {
    try {
        const data = fs.readFileSync(leaderboardFile);
        return JSON.parse(data);
    } catch (error) {
        console.error("Fehler beim Lesen der Bestenliste:", error);
        return [];
    }
}

// Hilfsfunktion: Bestenliste speichern
function writeLeaderboard(data) {
    try {
        fs.writeFileSync(leaderboardFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fehler beim Schreiben der Bestenliste:", error);
    }
}

// Route: Bestenliste abrufen
app.get("/leaderboard", (req, res) => {
    const leaderboard = readLeaderboard();
    res.json(leaderboard.sort((a, b) => b.score - a.score).slice(0, 10));
});

// Route: Neuen Highscore speichern
app.post("/submit", (req, res) => {
    const { name, score } = req.body;

    if (!name || score === undefined) {
        return res.status(400).json({ message: "Name und Score sind erforderlich!" });
    }

    const leaderboard = readLeaderboard();
    leaderboard.push({ name, score });
    writeLeaderboard(leaderboard);

    res.json({ message: "Score erfolgreich gespeichert!" });
});

// Route: Bestenliste bearbeiten (Admin-Funktion)
app.post("/admin/update", (req, res) => {
    const { newLeaderboard } = req.body;

    if (!Array.isArray(newLeaderboard)) {
        return res.status(400).json({ message: "Ungültige Bestenliste-Daten!" });
    }

    writeLeaderboard(newLeaderboard);
    res.json({ message: "Bestenliste erfolgreich aktualisiert!" });
});

// Route: Server-Status prüfen
app.get("/", (req, res) => {
    res.send("Snake Server läuft!");
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
