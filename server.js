const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const port = process.env.PORT || 5000;

// Mittelware
app.use(bodyParser.json());
app.use(cors());

// In-Memory-Datenbank für Leaderboard (kann später in eine echte DB umgewandelt werden)
let leaderboard = [];

// Lade bestehende Bestenliste (wenn vorhanden)
const loadLeaderboard = () => {
    if (fs.existsSync('leaderboard.json')) {
        const data = fs.readFileSync('leaderboard.json', 'utf8');
        leaderboard = JSON.parse(data);
    }
};

// Speichere die Bestenliste
const saveLeaderboard = () => {
    fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard, null, 2), 'utf8');
};

// Bestenliste abrufen
app.get('/leaderboard', (req, res) => {
    loadLeaderboard();
    leaderboard.sort((a, b) => b.score - a.score); // Sortiere die Liste nach Punktzahl
    res.json(leaderboard.slice(0, 10)); // Gebe nur die Top 10 zurück
});

// Punktzahl des Spielers senden
app.post('/submitScore', (req, res) => {
    const { name, score } = req.body;
    loadLeaderboard();

    // Füge den neuen Spieler hinzu
    leaderboard.push({ name, score });

    // Speichern der aktualisierten Bestenliste
    saveLeaderboard();

    res.json({ success: true });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
