import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import API from "../../utils/api";

const UserPayment = ({ course, userId, onClose }) => {
  const [method, setMethod] = useState("jazzcash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const paymentNumber = "03214320946";
  const whatsappNumber = "+92 3214320946";

  // ---------- Mount animation ----------
  useEffect(() => {
    setIsOpen(true);
  }, []);

  // ---------- Focus trap & Escape key ----------
  useEffect(() => {
    const previousFocus = document.activeElement;

    // Focus the close button on mount
    setTimeout(() => closeButtonRef.current?.focus(), 50);

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      previousFocus?.focus?.();
    };
  }, [onClose]);

  // ---------- Copy to clipboard ----------
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ---------- Submit payment ----------
  const submitPayment = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!userId || !course?._id) {
        setError("Missing user or course info");
        setLoading(false);
        return;
      }

      const payload = {
        userId,
        courseId: course._id,
        paymentMethod: method,
      };

      await axios.post(`${API}/enroll/enroll`, payload);

      setSuccess("Payment submitted successfully!");

      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ---------- OVERLAY ----------
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end sm:justify-center p-1 sm:p-4"
      style={{
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.3s ease-out",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Payment modal"
    >
      {/* ---------- MODAL ---------- */}
      <div
        ref={modalRef}
        className="w-[81%] sm:w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- HEADER ---------- */}
        <div className="sticky top-0 z-10 bg-black dark:bg-zinc-800 text-white p-3 rounded-t-xl sm:rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-sm sm:text-lg font-bold">Enrollment</h2>
            <p className="text-[10px] sm:text-xs text-gray-300 truncate max-w-[140px] sm:max-w-[240px]">
              {course?.title || "Course"}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ---------- BODY ---------- */}
        <div className="p-3 space-y-2 sm:space-y-3">
          {/* Error */}
          {error && (
            <div className="flex items-start gap-1.5 text-[10px] sm:text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-1.5 sm:p-2 rounded border border-red-100 dark:border-red-800">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-start gap-1.5 text-[10px] sm:text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-1.5 sm:p-2 rounded border border-green-100 dark:border-green-800">
              <CheckCircle2 size={12} className="flex-shrink-0 mt-0.5" />
              <span className="flex-1">{success}</span>
            </div>
          )}

          {/* Course info */}
          <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-2">
            <p className="font-semibold text-xs sm:text-sm dark:text-white">
              {course?.title || "Untitled Course"}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {course?.description || "No description available."}
            </p>
          </div>

          {/* Payment info */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 space-y-2.5">
            {/* Payment Number */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold text-[10px] sm:text-xs">
                  <Smartphone size={12} className="sm:w-3.5 sm:h-3.5" />
                  Payment Number
                </div>
                <button
                  onClick={() => copyToClipboard(paymentNumber)}
                  className="p-0.5 rounded hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors text-green-600 dark:text-green-400"
                  aria-label="Copy payment number"
                >
                  {copied ? (
                    <Check size={12} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
              <p className="font-mono font-bold text-black dark:text-white text-xs sm:text-sm mt-0.5">
                {paymentNumber}
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-300 mt-0.5">
                JazzCash account – send payment to this number.
              </p>
            </div>

            {/* WhatsApp Number */}
            <div className="pt-2 border-t border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold text-[10px] sm:text-xs">
                  <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                  WhatsApp Slip Number
                </div>
                <button
                  onClick={() => copyToClipboard(whatsappNumber)}
                  className="p-0.5 rounded hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors text-green-600 dark:text-green-400"
                  aria-label="Copy WhatsApp number"
                >
                  {copied ? (
                    <Check size={12} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
              <p className="font-mono font-bold text-black dark:text-white text-xs sm:text-sm mt-0.5">
                {whatsappNumber}
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-300 mt-0.5">
                Send payment screenshot, name, and email for verification.
              </p>
            </div>
          </div>

          {/* Payment method */}
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setMethod("jazzcash")}
              className={`flex items-center justify-center gap-1 p-2 rounded-lg border text-[10px] sm:text-xs transition-all ${
                method === "jazzcash"
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm"
                  : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
              }`}
            >
              <Smartphone size={12} className="sm:w-3.5 sm:h-3.5" />
              JazzCash
            </button>
            <button
              onClick={() => setMethod("easypaisa")}
              className={`flex items-center justify-center gap-1 p-2 rounded-lg border text-[10px] sm:text-xs transition-all ${
                method === "easypaisa"
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm"
                  : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
              }`}
            >
              <CreditCard size={12} className="sm:w-3.5 sm:h-3.5" />
              EasyPaisa
            </button>
          </div>

          {/* Admin note */}
          <div className="bg-gray-100 dark:bg-zinc-800/50 text-gray-700 dark:text-gray-300 text-[9px] sm:text-[10px] p-1.5 sm:p-2 rounded flex items-center gap-1.5">
            <ShieldCheck size={12} className="flex-shrink-0" />
            <span>Your enrollment will be approved by admin.</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={submitPayment}
              disabled={loading}
              className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg text-[11px] sm:text-xs font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Processing
                </>
              ) : (
                "Confirm Payment"
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-[11px] sm:text-xs font-semibold hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPayment;