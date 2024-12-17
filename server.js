const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let leaderboard = [
    { name: "Max", score: 150 },
    { name: "Anna", score: 130 },
    { name: "Lucas", score: 120 },
    { name: "John", score: 110 },
    { name: "Sarah", score: 100 },
    { name: "Tom", score: 90 },
    { name: "Kate", score: 80 },
    { name: "Chris", score: 70 },
    { name: "Lena", score: 60 },
    { name: "Paul", score: 50 }
];

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API-Endpunkt zum Abrufen des Leaderboards
app.get('/leaderboard', (req, res) => {
    // Wir senden nur die besten 10 Spieler
    res.json(leaderboard);
});

// API-Endpunkt zum Hinzufügen einer Punktzahl
app.post('/admin/leaderboard', (req, res) => {
    const { password, action, name, score } = req.body;
    const adminPassword = "admin123"; // Beispiel für Admin-Passwort

    // Authentifizierung des Admins
    if (password !== adminPassword) {
        return res.status(401).json({ success: false, message: 'Falsches Passwort!' });
    }

    // Hinzufügen der Punktzahl
    if (action === "add" && name && !isNaN(score)) {
        leaderboard.push({ name, score });
        leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10); // Sortieren und nur die Top 10 anzeigen
        return res.json({ success: true, message: 'Punktzahl hinzugefügt!' });
    }

    // Entfernen eines Spielers
    if (action === "remove" && name) {
        leaderboard = leaderboard.filter(entry => entry.name !== name);
        leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10); // Nach dem Entfernen neu sortieren
        return res.json({ success: true, message: 'Punktzahl entfernt!' });
    }

    return res.status(400).json({ success: false, message: 'Ungültige Anfrage!' });
});

// Start des Servers
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
