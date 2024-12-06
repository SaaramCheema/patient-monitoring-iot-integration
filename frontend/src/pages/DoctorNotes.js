import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Edit, Eye, FileText } from "lucide-react";

const DoctorNotes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorNotes = async () => {
    try {
      const response = await fetch("http://localhost:3001/doctor/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchDoctorNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 flex justify-between h-16 items-center">
            <div className="flex items-center">
              <UserCircle className="h-8 w-8 text-indigo-600" />
              <span 
                onClick={() => navigate("/doctorhome")} 
                className="ml-3 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent cursor-pointer"
              >
                HealthCare
              </span>
            </div>
            <div className="flex items-center space-x-4">
            <button
                onClick={() => navigate("/doctornotes")}
                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <FileText className="h-5 w-5 mr-2" />
                My Notes
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:opacity-90 transition-opacity"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto p-8 mt-4">
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span>My Notes</span>
          </h1>
          <p className="text-gray-600 max-w-xl">
            View and manage notes for patients and their alerts with precision and care.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse w-12 h-12 bg-indigo-300 rounded-full"></div>
          </div>
        ) : notes.length > 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-indigo-50">
                <tr>
                  {["Patient ID", "Alert ID", "Note Content", "Status", "Actions"].map((header) => (
                    <th key={header} className="py-3 px-4 text-sm font-semibold text-indigo-800 border-b border-indigo-200">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notes.map((note, index) => (
                  <tr 
                    key={note._id} 
                    className={`hover:bg-indigo-50/50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-3 px-4 border-b">{note.patientId}</td>
                    <td className="py-3 px-4 border-b">{note.alertId}</td>
                    <td className="py-3 px-4 border-b truncate max-w-xs">{note.content}</td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          note.status === "Acknowledged"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {note.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button
                        className="flex items-center text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-300"
                        onClick={() => navigate(`/note/${note._id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-indigo-50 rounded-xl border border-indigo-100">
            <FileText className="w-12 h-12 text-indigo-300 mb-4" />
            <p className="text-gray-500 text-center">No notes found. Start creating your first note!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorNotes;