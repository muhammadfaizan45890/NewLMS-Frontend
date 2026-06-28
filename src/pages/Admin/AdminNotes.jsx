import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Upload,
  Trash2,
  BookOpen,
  Loader2,
  FilePlus2, // ✅ FIXED (was missing)
} from "lucide-react";
import API from "../../utils/api"


const AdminNotes = () => {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
  });

  const [pdf, setPdf] = useState(null);

  // ================= FETCH COURSES =================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/admin/courses`);
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourses();
  }, []);

  // ================= FETCH NOTES =================
  const fetchNotes = async () => {
    try {
      setFetching(true);

      const res = await axios.get(`${API}/notes/all`);

      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ================= UPLOAD NOTES =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

if (!pdf) {
  alert("Please select PDF");
  return;
}

const data = new FormData();
data.append("title", form.title);
data.append("description", form.description);
data.append("courseId", form.courseId);
data.append("pdf", pdf); // MUST MATCH multer field name

  if (!pdf) {
  alert("Please select PDF");
  return;
}

      await axios.post(`${API}/notes/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ title: "", description: "", courseId: "" });
      setPdf(null);

      fetchNotes();
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-3 rounded-2xl">
            <FileText size={28} />
          </div>

          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Admin Notes Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Manage course PDFs & learning materials
            </p>
          </div>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl shadow text-sm">
          Total Notes:{" "}
          <span className="font-bold">{notes.length}</span>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ================= UPLOAD CARD ================= */}
        <div className="bg-white p-6 rounded-3xl shadow-lg h-fit">

          <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
            <FilePlus2 size={20} />
            Upload Notes
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Notes Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="w-full border p-3 rounded-xl"
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border p-3 rounded-xl h-28"
            />

            <select
              value={form.courseId}
              onChange={(e) =>
                setForm({ ...form, courseId: e.target.value })
              }
              className="w-full border p-3 rounded-xl"
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              className="w-full border p-2 rounded-xl"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Notes
                </>
              )}
            </button>
          </form>
        </div>

        {/* ================= NOTES LIST ================= */}
        <div className="lg:col-span-2">

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            Uploaded Notes
          </h2>

          {/* LOADING */}
          {fetching ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" size={30} />
            </div>
          ) : notes.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl text-center shadow">
              <FileText className="mx-auto mb-3 text-gray-400" size={40} />
              <p className="text-gray-500">
                No notes uploaded yet
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">

              {notes.map((n) => (
                <div
                  key={n._id}
                  className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition"
                >

                  <h3 className="font-bold text-lg">
                    {n.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {n.courseId?.title}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    {n.description}
                  </p>

                  <a
                    href={`${API}/files/notes/${n.pdf}`}
                    target="_blank"
                    className="text-blue-600 text-sm mt-3 inline-block"
                  >
                    View PDF
                  </a>

                  <button
                    onClick={() => deleteNote(n._id)}
                    className="flex items-center gap-2 text-red-500 mt-3 text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotes;