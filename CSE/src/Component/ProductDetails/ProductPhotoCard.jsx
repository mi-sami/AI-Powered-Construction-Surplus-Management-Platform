import React from "react";

const ProductPhotoCard = ({ image, title }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm h-full flex flex-col">
      <h2 className="text-sm font-bold text-gray-900 mb-4">Product photo</h2>
      <div className="w-full flex-1 min-h-[300px] bg-[#f4f3ef] rounded border border-gray-100 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title || "Product photo"}
            className="w-full h-full object-contain max-h-[340px]"
          />
        ) : (
          <span className="text-xs text-gray-400 font-medium">No photo available</span>
        )}
      </div>
    </div>
  );
};

export default ProductPhotoCard;