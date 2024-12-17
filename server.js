const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "leaderboard.json";

app.use(express.json());
app.use(cors());

// Bestenliste anzeigen
app.get("/leaderboard", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// Bestenliste Eintrag hinzufügen
app.post("/leaderboard", (req, res) => {
    const { name, score } = req.body;
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    data.push({ name, score });
    data.sort((a, b) => b.score - a.score);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data.slice(0, 10)));
    res.sendStatus(200);
});

// Bestenliste löschen
app.delete("/leaderboard", (req, res) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
