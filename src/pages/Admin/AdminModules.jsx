import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  Plus,
  Trash2,
  BookOpen,
  PlayCircle,
  Loader2
} from "lucide-react"
import API from "../../utils/api";

const AdminModules = () => {

  // ================= STATES =================
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [modules, setModules] = useState([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [moduleLoading, setModuleLoading] = useState(false)

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${API}/admin/courses`)

      setCourses(res.data)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // ================= FETCH MODULES =================
  const fetchModules = async (courseId) => {
    try {
      setModuleLoading(true)

      const res = await axios.get(
        `${API}/api/modules/course/${courseId}`
      )

      setModules(res.data)

    } catch (error) {
      console.log(error)
    } finally {
      setModuleLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  // ================= SELECT COURSE =================
  const handleSelectCourse = (course) => {
    setSelectedCourse(course)
    fetchModules(course._id)
  }

  // ================= ADD MODULE =================
  const addModule = async () => {
    if (!selectedCourse) return alert("Select a course first")

    try {
      setAdding(true)

      await axios.post(`${API}/api/modules/create`, {
        courseId: selectedCourse._id,
        title,
        description,
        youtubeUrl: videoUrl
      })

      setTitle("")
      setDescription("")
      setVideoUrl("")

      fetchModules(selectedCourse._id)

    } catch (error) {
      console.log(error)
      alert("Error adding module")
    } finally {
      setAdding(false)
    }
  }

  // ================= DELETE MODULE =================
  const deleteModule = async (id) => {
    try {
      await axios.delete(`${API}/api/modules/${id}`)

      fetchModules(selectedCourse._id)

    } catch (error) {
      console.log(error)
    }
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-zinc-100 p-4 sm:p-6 lg:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          Admin Modules
        </h1>
        <p className="text-zinc-600 mt-1">
          Manage course modules and YouTube videos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= COURSES ================= */}
        <div className="bg-white rounded-3xl p-5 shadow">

          <div className="flex items-center gap-2 mb-4">
            <BookOpen />
            <h2 className="font-bold text-lg">Courses</h2>
          </div>

          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="space-y-3">

              {courses.map(course => (
                <button
                  key={course._id}
                  onClick={() => handleSelectCourse(course)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedCourse?._id === course._id
                      ? "bg-black text-white"
                      : "bg-white hover:bg-zinc-100"
                  }`}
                >
                  {course.title}
                </button>
              ))}

            </div>
          )}

        </div>

        {/* ================= ADD MODULE ================= */}
        <div className="bg-white rounded-3xl p-5 shadow">

          <h2 className="text-lg font-bold mb-4">
            Add Module
          </h2>

          <p className="text-sm text-zinc-500 mb-3">
            {selectedCourse
              ? `Selected: ${selectedCourse.title}`
              : "Select a course first"}
          </p>

          <input
            placeholder="Module Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded-xl mb-3"
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-xl mb-3"
          />

          <input
            placeholder="YouTube Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full border p-2 rounded-xl mb-3"
          />

          <button
            onClick={addModule}
            disabled={adding}
            className="w-full bg-black text-white py-2 rounded-xl flex items-center justify-center gap-2"
          >
            {adding ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Module
              </>
            )}
          </button>

        </div>

        {/* ================= MODULE LIST ================= */}
        <div className="bg-white rounded-3xl p-5 shadow">

          <h2 className="text-lg font-bold mb-4">
            Modules
          </h2>

          {!selectedCourse ? (
            <p className="text-zinc-500">
              Select a course to view modules
            </p>
          ) : moduleLoading ? (
            <Loader2 className="animate-spin" />
          ) : modules.length === 0 ? (
            <p className="text-zinc-500">
              No modules found
            </p>
          ) : (
            <div className="space-y-3">

              {modules.map((m) => (
                <div
                  key={m._id}
                  className="border p-3 rounded-xl flex justify-between items-start"
                >

                  <div>
                    <h3 className="font-semibold">
                      {m.title}
                    </h3>

                    <p className="text-xs text-zinc-500">
                      {m.description}
                    </p>

                    <a
                      href={m.youtubeUrl}
                      target="_blank"
                      className="flex items-center gap-1 mt-2 text-xs text-blue-600"
                    >
                      <PlayCircle size={14} />
                      Watch Video
                    </a>
                  </div>

                  <button
                    onClick={() => deleteModule(m._id)}
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default AdminModules