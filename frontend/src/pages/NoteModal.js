import React, { useEffect, useState } from "react";

const NoteModal = ({ alert, onClose }) => {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("Sent");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:3001/doctor/notes/${alert._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setNote(data[0].content);
            setStatus(data[0].status);
          }
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
    fetchNote();
  }, [alert]);

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3001/doctor/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          alertId: alert._id,
          content: note,
          status,
        }),
      });
      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-indigo-800">Manage Note</h2>
        </div>
        
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all duration-300 ease-in-out resize-none"
            placeholder="Write your note here..."
          />
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all duration-300 ease-in-out"
            >
              <option value="Sent">Sent</option>
              <option value="Acknowledged">Acknowledged</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;