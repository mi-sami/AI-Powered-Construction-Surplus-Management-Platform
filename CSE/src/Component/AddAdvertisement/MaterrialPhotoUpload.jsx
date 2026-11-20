import React from "react";

const MaterialPhotoUpload = ({ onImageSelect, previewUrl }) => {
  // ছবিকে রিসাইজ এবং কম্প্রেস করে ছোট Base64 স্ট্রিং বানানোর ফাংশন
  const compressAndConvertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // সর্বোচ্চ প্রস্থ 800px
        const scaleSize = MAX_WIDTH / img.width;

        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // JPEG ফরম্যাটে 70% কোয়ালিটিতে কম্প্রেস (সাইজ অনেক কমে যাবে)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        if (onImageSelect) {
          onImageSelect(compressedBase64);
        }
      };
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      compressAndConvertToBase64(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      compressAndConvertToBase64(file);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">1. Material photo</h3>

      {/* Dropzone / Preview Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full h-64 border-2 border-none border-gray-300 rounded-lg bg-gray-50/50 flex flex-col items-center justify-center overflow-hidden relative"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-4">
            <p className="text-xs text-gray-500 font-medium">
              Drag & drop a photo here, or click below to browse
            </p>
            <p className="text-[11px] text-gray-400 mt-1">PNG, JPG (Auto-compressed)</p>
          </div>
        )}
      </div>

      {/* Choose Photo Button */}
      <div className="mt-4">
        <label className="inline-block px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded shadow-sm cursor-pointer transition-colors">
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