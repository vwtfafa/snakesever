const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let leaderboard = [];

// Middleware für JSON-Verarbeitung
app.use(express.json());

// Route, um einen neuen Punktestand zu speichern
app.post('/submit', (req, res) => {
    const { name, score } = req.body;
    
    // Füge den neuen Punktestand hinzu
    leaderboard.push({ name, score });

    // Sortiere die Bestenliste nach Punkten (absteigend) und behalte nur die besten 10
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    // Speichern der Bestenliste
    fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard));

    res.json({ message: 'Score submitted successfully!' });
});

// Route, um die Bestenliste abzurufen
app.get('/leaderboard', (req, res) => {
    // Lade die Bestenliste aus der Datei
    try {
        const data = fs.readFileSync('leaderboard.json', 'utf8');
        leaderboard = JSON.parse(data);
    } catch (err) {
        leaderboard = [];
    }
    res.json(leaderboard);
});

// Route für Admin-Seite (Verwaltung der Bestenliste)
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// Admin-Daten löschen oder bearbeiten (nur für Admin)
app.post('/admin/edit', (req, res) => {
    const { action, index } = req.body;

    if (action === 'delete') {
        leaderboard.splice(index, 1);
    }

    // Speichern nach Änderungen
    fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard));
    res.json({ message: 'Leaderboard updated' });
});

// Admin Passwort (zum Schutz)
const ADMIN_PASSWORD = "admin123";

// Admin-Seite bearbeiten
app.get('/admin.html', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
