import React from "react";
import { nanoid } from "nanoid";

// Simple components without third-party dependencies
function SimpleSidebar({ notes, currentNote, setCurrentNoteId, newNote, deleteNote }) {
  const noteElements = notes.map((note) => (
    <div key={note.id}>
      <div
        className={`title ${
          note.id === currentNote?.id ? "selected-note" : ""
        }`}
        onClick={() => setCurrentNoteId(note.id)}
        style={{
          padding: "10px",
          border: note.id === currentNote?.id ? "2px solid blue" : "1px solid gray",
          cursor: "pointer",
          marginBottom: "5px"
        }}
      >
        <h4>{note.body.split("\n")[0]}</h4>
        <button onClick={(event) => {
          event.stopPropagation();
          deleteNote(event, note.id);
        }}>
          Delete
        </button>
      </div>
    </div>
  ));

  return (
    <section style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}>
      <div>
        <h3>Notes</h3>
        <button onClick={newNote} style={{ marginLeft: "10px" }}>
          + New Note
        </button>
      </div>
      {noteElements}
    </section>
  );
}

function SimpleEditor({ currentNote, updateNote }) {
  if (!currentNote) {
    return <div style={{ width: "70%", padding: "20px" }}>No note selected</div>;
  }

  return (
    <section style={{ width: "70%", padding: "20px" }}>
      <textarea
        value={currentNote.body || ""}
        onChange={(e) => updateNote(e.target.value)}
        style={{
          width: "100%",
          height: "400px",
          fontFamily: "monospace",
          fontSize: "14px",
          padding: "10px"
        }}
      />
    </section>
  );
}

export default function TestApp() {
  const [notes, setNotes] = React.useState(() => {
    try {
      const savedNotes = localStorage.getItem("notes");
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
      return [];
    }
  });
  
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  React.useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes to localStorage:", error);
    }
  }, [notes]);

  function createNewNote() {
    try {
      const newId = nanoid();
      console.log("Generated new note ID:", newId);
      
      const newNote = {
        id: newId,
        body: "# Type your markdown note's title here",
      };
      
      setNotes(prevNotes => {
        console.log("Previous notes count:", prevNotes.length);
        const newNotes = [newNote, ...prevNotes];
        console.log("New notes count:", newNotes.length);
        return newNotes;
      });
      
      console.log("Setting current note ID to:", newId);
      setCurrentNoteId(newId);
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  }

  function updateNote(text) {
    setNotes((oldNotes) => {
      const newArray = [];
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text });
        } else {
          newArray.push(oldNote);
        }
      }
      return newArray;
    });
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((oldNotes) => {
      const newNotes = oldNotes.filter((note) => note.id !== noteId);
      if (noteId === currentNoteId) {
        setCurrentNoteId(newNotes.length > 0 ? newNotes[0].id : "");
      }
      return newNotes;
    });
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  console.log("Rendering with notes:", notes.length, "currentNoteId:", currentNoteId);

  return (
    <main style={{ display: "flex", height: "100vh" }}>
      {notes.length > 0 ? (
        <>
          <SimpleSidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && findCurrentNote() && (
            <SimpleEditor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </>
      ) : (
        <div style={{ padding: "50px", textAlign: "center", width: "100%" }}>
          <h1>You have no notes</h1>
          <button onClick={createNewNote} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}