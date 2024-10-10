"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await fetch("/api/notes");
    if (response.ok) {
      const data = await response.json();
      setNotes(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote }),
    });

    if (response.ok) {
      setNewNote("");
      setShowAddNote(false);
      fetchNotes();
    }
  };

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="flex justify-between items-center p-2 border-b">
        <h2 className="text-lg font-semibold">Notes</h2>
        <Button onClick={() => setShowAddNote(true)} size="sm">
          Add
        </Button>
      </div>

      {showAddNote && (
        <form onSubmit={handleSubmit} className="p-2 border-b">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full p-1 border rounded"
            placeholder="Add a new note..."
            rows="3"
          />
          <div className="mt-1 flex justify-end space-x-2">
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddNote(false)}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="p-2 space-y-2">
        {notes
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map((note, index) => (
            <div key={index} className="bg-gray-50 rounded p-2 border">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {new Date(note.timestamp).toLocaleDateString()}
                </span>
                <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-gray-800 text-sm mt-1 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
