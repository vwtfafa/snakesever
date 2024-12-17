const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

let leaderboard = [];

// Middleware
app.use(bodyParser.json());

// Punktestand speichern
app.post('/submitScore', (req, res) => {
    const { name, score } = req.body;
    if (!name || !score) {
        return res.status(400).send('Name und Punktestand sind erforderlich');
    }

    // Punktestand speichern
    leaderboard.push({ name, score });
    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10); // Bestenliste begrenzen auf Top 10

    res.status(200).json({ message: 'Punktestand gespeichert' });
});

// Bestenliste abrufen
app.get('/leaderboard', (req, res) => {
    res.status(200).json(leaderboard);
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
