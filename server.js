const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Wir simulieren eine Datenbank mit einem einfachen Array für das Leaderboard
let leaderboard = [
    { name: 'Alice', score: 100 },
    { name: 'Bob', score: 80 },
    { name: 'Charlie', score: 60 }
];

// Middleware für JSON-Parsing
app.use(express.json());

// Statische Dateien bereitstellen (HTML, CSS, JS)
app.use(express.static('public'));

// Endpunkt zum Abrufen des Leaderboards
app.get('/leaderboard', (req, res) => {
    res.json(leaderboard);
});

// Endpunkt zum Hinzufügen eines neuen Scores
app.post('/submit', (req, res) => {
    const { name, score } = req.body;

    if (!name || !score) {
        return res.status(400).send('Name und Score sind erforderlich.');
    }

    // Füge den neuen Score zum Leaderboard hinzu
    leaderboard.push({ name, score });

    // Sortiere das Leaderboard nach Punktzahl in absteigender Reihenfolge
    leaderboard.sort((a, b) => b.score - a.score);

    // Beschränke das Leaderboard auf die besten 10 Einträge
    leaderboard = leaderboard.slice(0, 10);

    res.status(200).send('Score erfolgreich hinzugefügt');
});

// Starte den Server
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
