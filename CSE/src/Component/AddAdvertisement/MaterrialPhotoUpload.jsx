import React, { useState } from "react";

const MaterialPhotoUpload = ({ onImageSelect, previewUrl }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageSelect(url);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">1. Material photo</h3>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const url = URL.createObjectURL(e.dataTransfer.files[0]);
            onImageSelect(url);
          }
        }}
        className={`border-2 border-none rounded-md h-64 flex flex-col items-center justify-center p-4 transition-colors ${
          dragActive ? "border-[#008ba9] bg-cyan-50/20" : "border-gray-300 bg-gray-50/40"
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Material Preview"
            className="h-full w-full object-contain rounded"
          />
        ) : (
          <p className="text-xs text-gray-400 font-medium text-center">
            Drop a photo here or choose a file
          </p>
        )}
      </div>

      {/* Choose Photo Button */}
      <div className="mt-4">
        <label className="inline-block px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-sm">
          Choose photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default MaterialPhotoUpload;