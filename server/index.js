const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const Database = require("better-sqlite3");
const db = new Database("notes.db");

db.exec(`CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT,
  body TEXT,
  tags TEXT,
  created_at TEXT,
  updated_at TEXT
)`);

const app = express();
app.use(bodyParser.json());

app.get("/notes", (req, res) => {
  const q = req.query.q || "";
  const stmt = db.prepare(`SELECT * FROM notes WHERE title LIKE ? OR body LIKE ? ORDER BY updated_at DESC`);
  const rows = stmt.all(`%${q}%`, `%${q}%`).map(r => ({ ...r, tags: JSON.parse(r.tags || "[]") }));
  res.json(rows);
});

app.post("/notes", (req, res) => {
  const id = uuid();
  const now = new Date().toISOString();
  const { title = "", body = "", tags = [] } = req.body;
  const stmt = db.prepare(`INSERT INTO notes (id,title,body,tags,created_at,updated_at) VALUES (?,?,?,?,?,?)`);
  stmt.run(id, title, body, JSON.stringify(tags), now, now);
  res.json({ id, title, body, tags, created_at: now, updated_at: now });
});

app.put("/notes/:id", (req, res) => {
  const id = req.params.id;
  const now = new Date().toISOString();
  const { title, body, tags } = req.body;
  const stmt = db.prepare(`UPDATE notes SET title=?, body=?, tags=?, updated_at=? WHERE id=?`);
  stmt.run(title, body, JSON.stringify(tags), now, id);
  res.json({ id, title, body, tags, updated_at: now });
});

app.delete("/notes/:id", (req, res) => {
  const id = req.params.id;
  const stmt = db.prepare(`DELETE FROM notes WHERE id=?`);
  stmt.run(id);
  res.json({ success: true });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));