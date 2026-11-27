import React from "react";

const DocumentPreviewModal = ({ imageUrl, applicantName, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-4 max-w-2xl w-full shadow-2xl border border-purple-200"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">
            {applicantName} — Submitted Document
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          >
            Close
          </button>
        </div>
        <img
          src={imageUrl}
          alt="Full Document"
          className="w-full max-h-[75vh] object-contain rounded-lg bg-gray-100"
        />
      </div>
    </div>
  );
};

export default DocumentPreviewModal;