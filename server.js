const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let leaderboard = [
    { name: 'Alice', score: 100 },
    { name: 'Bob', score: 80 },
    { name: 'Charlie', score: 60 }
];

// Setzt den static file route (damit HTML, CSS, JS geladen wird)
app.use(express.static('public'));

// API zum Abrufen des Leaderboards
app.get('/leaderboard', (req, res) => {
    res.json(leaderboard);
});

// API zum Hinzufügen von Scores
app.post('/submit', express.json(), (req, res) => {
    leaderboard.push(req.body);
    leaderboard.sort((a, b) => b.score - a.score);  // sortiert die Liste absteigend
    leaderboard = leaderboard.slice(0, 10); // nur die besten 10
    res.status(200).send('Score added');
});

app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
