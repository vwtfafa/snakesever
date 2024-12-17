const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000; // Du kannst den Port nach Bedarf anpassen

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Zum Parsen von JSON-Daten

// Leaderboard-Daten
const leaderboardFilePath = './leaderboard.json';

// Sicherstellen, dass die leaderboard.json-Datei existiert
if (!fs.existsSync(leaderboardFilePath)) {
    fs.writeFileSync(leaderboardFilePath, JSON.stringify([]));
}

// Endpunkt zum Einreichen des Scores
app.post('/submit', (req, res) => {
    const { name, score } = req.body;

    if (!name || !score) {
        return res.status(400).send('Name und Score sind erforderlich!');
    }

    // Bestehende Highscores abrufen
    const leaderboard = JSON.parse(fs.readFileSync(leaderboardFilePath));

    // Den neuen Score hinzufügen
    leaderboard.push({ name, score });

    // Sortieren der Liste und die besten 10 behalten
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 10) {
        leaderboard.pop();
    }

    // Speichern der aktualisierten Bestenliste
    fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard));

    res.json({ message: 'Score erfolgreich eingereicht!' });
});

// Endpunkt zum Abrufen der Bestenliste
app.get('/leaderboard', (req, res) => {
    const leaderboard = JSON.parse(fs.readFileSync(leaderboardFilePath));
    res.json(leaderboard);
});

// Endpunkt für Admin-Login (für Admin-Funktionen)
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        res.json({ message: 'Login erfolgreich!' });
    } else {
        res.status(401).send('Falscher Benutzername oder Passwort.');
    }
});

// Admin-Endpunkt zum Löschen eines Eintrags
app.post('/admin/delete', (req, res) => {
    const { name } = req.body;

    // Bestehende Leaderboard-Daten abrufen
    const leaderboard = JSON.parse(fs.readFileSync(leaderboardFilePath));

    // Eintrag finden und löschen
    const index = leaderboard.findIndex(entry => entry.name === name);
    if (index !== -1) {
        leaderboard.splice(index, 1);
        fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard));
        res.json({ message: `Eintrag von ${name} gelöscht!` });
    } else {
        res.status(404).send('Eintrag nicht gefunden.');
    }
});

// Admin-Endpunkt zum Hinzufügen eines Eintrags
app.post('/admin/add', (req, res) => {
    const { name, score } = req.body;

    if (!name || !score) {
        return res.status(400).send('Name und Score sind erforderlich!');
    }

    // Bestehende Leaderboard-Daten abrufen
    const leaderboard = JSON.parse(fs.readFileSync(leaderboardFilePath));

    // Eintrag hinzufügen
    leaderboard.push({ name, score });

    // Sortieren der Liste und die besten 10 behalten
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 10) {
        leaderboard.pop();
    }

    // Speichern der aktualisierten Bestenliste
    fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard));

    res.json({ message: `Eintrag für ${name} hinzugefügt!` });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
