import { useState } from "react";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function handleAddNote() {
    if (!title.trim() && !body.trim()) return;
    const newNote = {
      id: Date.now(),
      title,
      body,
    };
    setNotes([newNote, ...notes]);
    setTitle("");
    setBody("");
  }

  function handleDelete(id) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <div className="app-container">
      <h1> 🗒️Personal Notes</h1>

      <div className="input-box">
        <input
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write something beautiful..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty">No notes yet 💭</p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="note-card">
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              <button onClick={() => handleDelete(n.id)} className="delete-btn">
                ✖
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}