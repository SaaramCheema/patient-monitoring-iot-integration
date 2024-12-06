import React, { useState } from "react";

const NoteManagementModal = ({ note, onClose, onNoteUpdated }) => {
  const [status, setStatus] = useState(note.status);

  const updateStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/nurse/notes/${note._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify({ status: "Acknowledged" }),
        }
      );

      if (response.ok) {
        // Update status in the UI immediately after successful response
        setStatus("Acknowledged");
        // Call the parent callback to update note status in the parent component
        onNoteUpdated(note._id, "Acknowledged");
      } else {
        console.error("Failed to update note status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Manage Note</h2>
        <p className="mb-2">Content: {note.content}</p>
        <p className="mb-2">Status: {status}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={updateStatus}
          disabled={status === "Acknowledged"}
        >
          Acknowledge
        </button>
        <button
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NoteManagementModal;
