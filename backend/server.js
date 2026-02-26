const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

db.run(`
  CREATE TABLE IF NOT EXISTS rows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_path TEXT,
    text TEXT,
    translation TEXT
  )
`);

app.get("/rows", (req, res) => {
  db.all("SELECT * FROM rows", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/rows", (req, res) => {
  const { mediaPath, text, translation } = req.body;

  db.run(
    `INSERT INTO rows (media_path, text, translation) VALUES (?, ?, ?)`,
    [mediaPath, text, translation],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    },
  );
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
