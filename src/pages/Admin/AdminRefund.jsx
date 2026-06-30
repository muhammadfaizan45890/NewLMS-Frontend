import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Wallet,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Sparkles,
  Users,
  GraduationCap,
  BadgeDollarSign,
  RefreshCcw,
  Mail, // 👈 imported
} from "lucide-react";
import API from "../../utils/api";

const AdminRefund = () => {
  // ================= STATES =================
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  // ================= FETCH REFUNDS =================
  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/refund/all`);
      setRefunds(res.data || []);
      setFilteredRefunds(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = refunds.filter((item) =>
      item.courseTitle?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRefunds(filtered);
  }, [search, refunds]);

  // ================= UPDATE STATUS =================
  const updateStatus = async (refundId, status) => {
    try {
      setUpdatingId(refundId);
      await axios.put(`${API}/refund/update/${refundId}`, { status });
      fetchRefunds();
    } catch (error) {
      console.log(error);
      alert("Failed to update refund");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-xl px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-5 sm:mb-8">
              <Sparkles size={14} />
              Refund Management System
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-7xl font-black leading-tight tracking-tight">
              Admin Refund Panel
              <span className="block text-zinc-400 mt-1 sm:mt-2 text-base sm:text-lg lg:text-xl">
                Manage Student Refund Requests
              </span>
            </h1>
            <p className="mt-4 sm:mt-8 text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Review refund requests, approve or reject student
              submissions, and manage refund activities securely.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="relative px-3 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* ================= TOP BAR ================= */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-5 mb-6 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">
                Refund Requests
              </h2>
              <p className="text-zinc-500 mt-1 sm:mt-3 text-sm sm:text-base lg:text-lg">
                Track and manage all student refund requests.
              </p>
            </div>
            <div className="relative w-full lg:w-[400px]">
              <Search
                size={16}
                className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Search by course title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  h-11 sm:h-14
                  rounded-xl sm:rounded-2xl
                  border border-zinc-200
                  bg-white
                  pl-10 sm:pl-14 pr-4 sm:pr-5
                  outline-none
                  focus:border-black
                  text-sm sm:text-base
                "
              />
            </div>
          </div>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
            <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[30px] p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-black text-white flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black mt-3 sm:mt-6">
                {refunds.length}
              </h2>
              <p className="text-zinc-500 mt-1 sm:mt-2 text-sm sm:text-base">
                Total Requests
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[30px] p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-green-600 text-white flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black mt-3 sm:mt-6">
                {refunds.filter((item) => item.status === "approved").length}
              </h2>
              <p className="text-zinc-500 mt-1 sm:mt-2 text-sm sm:text-base">
                Approved
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[30px] p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-red-600 text-white flex items-center justify-center">
                <XCircle size={20} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black mt-3 sm:mt-6">
                {refunds.filter((item) => item.status === "rejected").length}
              </h2>
              <p className="text-zinc-500 mt-1 sm:mt-2 text-sm sm:text-base">
                Rejected
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[30px] p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-yellow-500 text-white flex items-center justify-center">
                <Clock3 size={20} />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black mt-3 sm:mt-6">
                {refunds.filter((item) => item.status === "pending").length}
              </h2>
              <p className="text-zinc-500 mt-1 sm:mt-2 text-sm sm:text-base">
                Pending
              </p>
            </div>
          </div>

          {/* ================= REFUNDS ================= */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[260px] sm:h-[280px] rounded-2xl sm:rounded-[35px] bg-white border border-zinc-200 animate-pulse"
                />
              ))}
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[35px] p-8 sm:p-14 text-center">
              <BadgeDollarSign size={40} className="mx-auto text-zinc-400" />
              <h2 className="text-xl sm:text-3xl font-black mt-4 sm:mt-6">
                No Refund Requests
              </h2>
              <p className="text-zinc-500 mt-2 sm:mt-4 text-sm sm:text-base">
                Refund requests will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {filteredRefunds.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[35px] p-4 sm:p-7 hover:shadow-[0_20px_80px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  {/* TOP */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-2xl font-black text-black break-words">
                        {item.courseTitle}
                      </h2>
                      {/* USER INFO – name + email */}
                      <div className="mt-2 sm:mt-4 space-y-1">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm sm:text-base">
                          <Users size={14} />
                          <span>{item.userId?.username || "Student"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-sm sm:text-base">
                          <Mail size={14} />
                          <span>{item.userId?.email || "No email"}</span>
                        </div>
                      </div>
                    </div>
                    {/* STATUS */}
                    <div
                      className={`
                        px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-bold whitespace-nowrap
                        ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {item.status}
                    </div>
                  </div>

                  {/* REASON */}
                  <div className="mt-4 sm:mt-6 bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-3xl p-3 sm:p-5">
                    <div className="flex items-center gap-2 mb-2 sm:mb-4">
                      <GraduationCap size={16} />
                      <h3 className="font-bold text-sm sm:text-base">
                        Refund Reason
                      </h3>
                    </div>
                    <p className="text-zinc-600 text-sm sm:text-base leading-relaxed break-words">
                      {item.reason}
                    </p>
                  </div>

                  {/* DATE */}
                  <div className="mt-3 sm:mt-5 flex items-center gap-2 text-zinc-500 text-xs sm:text-sm">
                    <Clock3 size={14} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>

                  {/* ACTIONS */}
                  {item.status === "pending" && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-5 sm:mt-8">
                      <button
                        onClick={() => updateStatus(item._id, "approved")}
                        disabled={updatingId === item._id}
                        className="
                          h-10 sm:h-14
                          rounded-xl sm:rounded-2xl
                          bg-green-600
                          hover:bg-green-700
                          text-white
                          font-semibold
                          text-sm sm:text-base
                          transition-all duration-300
                          disabled:opacity-60
                        "
                      >
                        {updatingId === item._id ? (
                          <RefreshCcw className="animate-spin mx-auto" size={16} />
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        onClick={() => updateStatus(item._id, "rejected")}
                        disabled={updatingId === item._id}
                        className="
                          h-10 sm:h-14
                          rounded-xl sm:rounded-2xl
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          font-semibold
                          text-sm sm:text-base
                          transition-all duration-300
                          disabled:opacity-60
                        "
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminRefund;
