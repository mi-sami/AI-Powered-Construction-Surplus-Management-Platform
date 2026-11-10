import React from "react";

const ProductDetailsForm = ({ register, errors, loading, onSaveDraft, isEditMode = false }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 sm:p-8 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-5">
        {isEditMode ? "Product details" : "2. Product details"}
      </h3>

      <div className="space-y-4">
        {/* Status Option (Only visible in Edit Mode) */}
        {isEditMode && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        )}

        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Product name *
          </label>
          <input
            type="text"
            placeholder="Name of the product"
            {...register("title", { required: "Product name is required" })}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
          {errors?.title && (
            <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>
          )}
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Product Type
          </label>
          <select
            {...register("category", { required: true })}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          >
            <option value="Tiles">Tiles</option>
            <option value="Bricks">Bricks</option>
            <option value="Cement">Cement</option>
            <option value="Steel">Steel</option>
            <option value="Pipes">Pipes</option>
            <option value="Paint">Paint</option>
            <option value="Sanitary items">Sanitary items</option>
          </select>
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Quantity *</label>
            <input
              type="number"
              placeholder="500"
              {...register("quantity", { required: true, valueAsNumber: true })}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Unit</label>
            <select
              {...register("unit")}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="sqft">sqft</option>
              <option value="bags">bags</option>
              <option value="pcs">pcs</option>
              <option value="ton">ton</option>
            </select>
          </div>
        </div>

        {/* Condition & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Condition</label>
            <select
              {...register("condition")}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="Unused">Unused</option>
              <option value="Used - Good">Used - Good</option>
              <option value="Scrap / Surplus">Scrap / Surplus</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Package unit (sqft) / Price (৳) *
            </label>
            <input
              type="number"
              placeholder="55"
              {...register("pricePerUnit", { required: true, valueAsNumber: true })}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
        </div>

        {/* Brand & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Brand</label>
            <input
              type="text"
              placeholder="Optional"
              {...register("brand")}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location *</label>
            <input
              type="text"
              placeholder="Bashundhara"
              {...register("location", { required: true })}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
        </div>

        {/* Available from */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Available from *</label>
          <input
            type="date"
            {...register("availableFrom")}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
          <textarea
            rows="3"
            {...register("description")}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2.5 text-white text-xs font-semibold rounded transition-colors cursor-pointer ${
              isEditMode
                ? "bg-[#1b5e3a] hover:bg-[#14472c]"
                : "bg-[#008ba9] hover:bg-[#007690]"
            }`}
          >
            {loading ? "Processing..." : isEditMode ? "Save changes" : "Publish advertisement"}
          </button>
          
          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              className="px-5 py-2.5 bg-[#eae9e5] hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              {isEditMode ? "Cancel" : "Save draft"}
            </button>
          )}
        </div>

        <p className="text-[11px] text-gray-400 mt-2 leading-tight">
          {isEditMode
            ? "After you save, the advertisement updates immediately in preview."
            : "Every advertisement is checked automatically. A flagged advertisement stays hidden until an admin reviews it."}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsForm;