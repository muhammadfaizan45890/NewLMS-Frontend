import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import API from "../../utils/api";

import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  User,
  GraduationCap,
  Sparkles,
  Loader2,
  UploadCloud,
  FileText,
  Download,
  X,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";

const AdminCertificate = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ================= FETCH REQUESTS =================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API}/certificate/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data?.data || []);
    } catch (error) {
      console.error("Fetch requests error:", error);
      toast.error(error.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ================= REJECT =================
  const rejectRequest = async (id) => {
    try {
      setProcessingId(id);
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        `${API}/certificate/admin/${id}/status`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Request rejected.");
        fetchRequests();
      } else {
        toast.error(res.data.message || "Rejection failed.");
      }
    } catch (error) {
      console.error("Reject error:", error);
      toast.error(error.response?.data?.message || "Failed to reject.");
    } finally {
      setProcessingId(null);
    }
  };

  // ================= UPLOAD CERTIFICATE =================
  const uploadCertificate = async (id, file) => {
    const formData = new FormData();
    formData.append("certificate", file);

    try {
      setUploadingId(id);
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${API}/certificate/admin/${id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Certificate uploaded successfully!");
        return true;
      } else {
        toast.error(res.data.message || "Upload failed.");
        return false;
      }
    } catch (error) {
      console.error("Upload error details:", error);
      const serverMsg = error.response?.data?.message || error.message;
      toast.error(serverMsg);
      return false;
    } finally {
      setUploadingId(null);
    }
  };

  // ================= HANDLE FILE SELECTION =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      e.target.value = null;
      return;
    }

    const id = e.target.dataset.applicationId;
    if (id) {
      setSelectedFile({ id, file, name: file.name });
    }
    e.target.value = null;
  };

  const triggerFilePicker = (applicationId) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.applicationId = applicationId;
      fileInputRef.current.click();
    }
  };

  // ================= UPLOAD + APPROVE =================
  const handleUploadAndApprove = async () => {
    if (!selectedFile) return;
    const { id, file } = selectedFile;

    const uploadSuccess = await uploadCertificate(id, file);
    if (uploadSuccess) {
      try {
        setProcessingId(id);
        const token = localStorage.getItem("accessToken");
        const res = await axios.put(
          `${API}/certificate/admin/${id}/status`,
          { status: "approved" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          toast.success("Request approved and certificate uploaded.");
          fetchRequests();
        } else {
          toast.error(res.data.message || "Approval failed.");
        }
      } catch (error) {
        console.error("Approval error:", error);
        toast.error(error.response?.data?.message || "Failed to approve.");
      } finally {
        setProcessingId(null);
        setSelectedFile(null);
      }
    } else {
      toast.error("Upload failed. Please try again.");
    }
  };

  const clearSelectedFile = () => setSelectedFile(null);

  // ================= FILTER REQUESTS =================
  const filteredRequests = requests.filter((item) => {
    const user = item.userId || {};
    const searchLower = searchQuery.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-zinc-100">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.png"
        onChange={handleFileChange}
      />

      {/* HERO */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />
        <div className="relative px-4 sm:px-6 lg:px-10 py-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs mb-4">
              <Sparkles size={14} />
              Certificate Management
            </div>
            <h1 className="text-3xl lg:text-5xl font-black">Certificate Requests</h1>
            <p className="text-zinc-300 mt-2 text-sm max-w-2xl">
              Review, approve, and upload certificates for students.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-4 sm:px-6 lg:px-10 py-6">
        <div className="bg-white rounded-3xl border border-zinc-200 p-4 sm:p-6 shadow-sm">
          {/* HEADER WITH SEARCH */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-black">All Requests</h2>
              <p className="text-sm text-zinc-500">
                Total: {filteredRequests.length} {filteredRequests.length !== requests.length && `(filtered from ${requests.length})`}
              </p>
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl border border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="border border-dashed border-zinc-300 rounded-3xl p-12 text-center">
              <Award size={48} className="mx-auto text-zinc-400" />
              <h3 className="text-xl font-bold mt-4">
                {requests.length === 0 ? "No Certificate Requests" : "No matching requests"}
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                {requests.length === 0
                  ? "Student certificate applications will appear here."
                  : "Try adjusting your search filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((item) => {
                const user = item.userId || {};
                return (
                  <div
                    key={item._id}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Course + User details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Award size={18} className="text-black" />
                            <h3 className="text-base font-bold">
                              {item.courseId?.title || "Unknown Course"}
                            </h3>
                          </div>
                          <span
                            className={`
                              px-2.5 py-0.5 rounded-full text-xs font-bold
                              ${
                                item.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : item.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            `}
                          >
                            {item.status || "pending"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 text-sm">
                          <div className="flex items-center gap-1.5 text-zinc-700">
                            <User size={14} />
                            <span className="font-medium">Name:</span>
                            <span className="truncate">{user.fullname || user.username || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-700">
                            <Mail size={14} />
                            <span className="font-medium">Email:</span>
                            <span className="truncate">{user.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-700">
                            <Shield size={14} />
                            <span className="font-medium">Role:</span>
                            <span className="capitalize">{user.role || "user"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-700">
                            <Clock3 size={14} />
                            <span className="font-medium">Applied:</span>
                            <span>
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Message (short) */}
                        {item.message && (
                          <div className="text-xs text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
                            <span className="font-medium">Message:</span> {item.message}
                          </div>
                        )}

                        {/* Admin remark & certificate link */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          {item.adminRemark && (
                            <div className="text-zinc-600 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-200">
                              <span className="font-medium">Admin:</span> {item.adminRemark}
                            </div>
                          )}
                          {item.certificateUrl && (
                            <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                              <FileText size={12} />
                              <a
                                href={item.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline font-medium flex items-center gap-1"
                              >
                                <Download size={12} />
                                Download
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions - compact */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:min-w-[160px]">
                        {item.status === "pending" && (
                          <>
                            {selectedFile && selectedFile.id === item._id ? (
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5 text-xs bg-zinc-100 px-2 py-1.5 rounded-lg border border-zinc-200">
                                  <FileText size={14} className="text-zinc-600" />
                                  <span className="truncate max-w-[100px]">
                                    {selectedFile.name}
                                  </span>
                                  <button
                                    onClick={clearSelectedFile}
                                    className="ml-auto text-zinc-500 hover:text-zinc-700"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                                <button
                                  onClick={handleUploadAndApprove}
                                  disabled={uploadingId === item._id || processingId === item._id}
                                  className="px-4 py-1.5 text-sm rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                                >
                                  {uploadingId === item._id || processingId === item._id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <UploadCloud size={14} />
                                  )}
                                  Upload & Approve
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => triggerFilePicker(item._id)}
                                  disabled={processingId === item._id || uploadingId === item._id}
                                  className="px-4 py-1.5 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                                >
                                  <FileText size={14} />
                                  Select
                                </button>
                                <button
                                  onClick={() => rejectRequest(item._id)}
                                  disabled={processingId === item._id}
                                  className="px-4 py-1.5 text-sm rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                                >
                                  {processingId === item._id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <XCircle size={14} />
                                  )}
                                  Reject
                                </button>
                              </>
                            )}
                          </>
                        )}
                        {/* View User removed */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminCertificate;