import React from "react";
import { useNavigate } from "react-router-dom";

const MyProjects = ({
  projects = [],
  loading = false,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (typeof onAddProject === "function") {
      onAddProject();
    } else {
      navigate("/add-advertisement");
    }
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    const formattedStatus = status ? status.toLowerCase() : "available";

    if (formattedStatus === "available") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full border border-emerald-600 text-emerald-700 bg-emerald-50/50">
          Available
        </span>
      );
    }
    if (formattedStatus === "under review" || formattedStatus === "pending") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full border border-amber-600 text-amber-800 bg-amber-50/50">
          Under Review
        </span>
      );
    }
    if (formattedStatus === "reserved") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-400 text-gray-700 bg-gray-100/50">
          Reserved
        </span>
      );
    }

    return (
      <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-300 text-gray-700 bg-gray-50">
        {status || "Active"}
      </span>
    );
  };

  // 👈 Delete Handler Logic with Confirmation
  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to remove this advertisement?")) {
      if (typeof onDeleteProject === "function") {
        onDeleteProject(id);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 sm:p-8 shadow-sm">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My advertisements</h2>

        <button
          type="button"
          onClick={handleAddClick}
          className="px-4 py-2 bg-[#008ba9] hover:bg-[#007690] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
        >
          + Add advertisement
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800 text-xs font-bold text-gray-900">
              <th className="pb-3 pr-4">Product</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4">Quantity</th>
              <th className="pb-3 px-4">Price</th>
              <th className="pb-3 px-4 text-center">Status</th>
              <th className="pb-3 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  Loading advertisements...
                </td>
              </tr>
            ) : projects && projects.length > 0 ? (
              projects.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Product Thumbnail & Title */}
                  <td className="py-4 pr-4 font-bold text-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded border border-gray-300 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium">
                            Photo
                          </span>
                        )}
                      </div>
                      <span className="line-clamp-2">
                        {item.title || item.name}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 text-gray-600">
                    {item.category || "N/A"}
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4 text-gray-700">
                    {item.quantity
                      ? `${item.quantity} ${item.unit || ""}`
                      : "N/A"}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {item.pricePerUnit ? (
                      <div>
                        ৳{item.pricePerUnit}/
                        <br />
                        <span className="font-normal text-gray-600">
                          {item.unit || "unit"}
                        </span>
                      </div>
                    ) : (
                      "৳[price]"
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 pl-4 text-right">
                    <div className="inline-flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/profile/edit-advertisement/${item.id}`)
                        }
                        className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item.id)} // 👈 Pass current item.id
                        className="px-3 py-1 bg-[#da3131] hover:bg-[#d10707] text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No advertisements found for your account. Click '+ Add
                  advertisement' to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Information Note */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Edit opens the advertisement so you can change its details. Delete
          removes it after you confirm. Under Review means an admin is checking
          it; buyers cannot see it until it is approved.
        </p>
      </div>
    </div>
  );
};

export default MyProjects;
