const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = "leaderboard.json";

// Lade die Bestenliste
function loadLeaderboard() {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Speichere die Bestenliste
function saveLeaderboard(leaderboard) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(leaderboard, null, 2));
}

// Route: Punktestand einreichen
app.post("/submit", (req, res) => {
    const { name, score } = req.body;

    if (!name || score === undefined) {
        return res.status(400).json({ error: "Ungültige Eingabe" });
    }

    const leaderboard = loadLeaderboard();
    leaderboard.push({ name, score });

    // Sortiere und begrenze auf Top 10
    leaderboard.sort((a, b) => b.score - a.score);
    saveLeaderboard(leaderboard.slice(0, 10));

    res.json({ success: true });
});

// Route: Bestenliste abrufen
app.get("/leaderboard", (req, res) => {
    const leaderboard = loadLeaderboard();
    res.json(leaderboard);
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
