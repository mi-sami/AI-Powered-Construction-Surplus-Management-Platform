import React from "react";

const DangerZoneDelete = ({ onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-red-600 mb-2">Delete advertisement</h3>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        Remove this advertisement from the marketplace. You will be asked to confirm.
      </p>
      <button
        type="button"
        onClick={onDelete}
        className="px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded text-xs font-semibold transition-colors cursor-pointer"
      >
        Delete this advertisement
      </button>
    </div>
  );
};

export default DangerZoneDelete;