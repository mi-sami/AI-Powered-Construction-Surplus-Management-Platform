import React from "react";

const DashboardAdvertisements = ({ advertisements = [], loading = false }) => {
  const getStatusBadge = (status) => {
    const formatted = status ? status.toLowerCase() : "active";

    if (formatted === "available" || formatted === "active") {
      return (
        <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-emerald-600 text-emerald-700 bg-emerald-50/50">
          Active
        </span>
      );
    }
    if (formatted === "under review" || formatted === "pending") {
      return (
        <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-amber-600 text-amber-800 bg-amber-50/50">
          Under Review
        </span>
      );
    }
    if (formatted === "reserved") {
      return (
        <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-gray-400 text-gray-700 bg-gray-100/60">
          Reserved
        </span>
      );
    }

    return (
      <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-gray-300 text-gray-700 bg-gray-50">
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">
          My advertisements
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800 text-xs font-bold text-gray-900">
                <th className="pb-2.5 pr-3">Material</th>
                <th className="pb-2.5 px-3">Quantity</th>
                <th className="pb-2.5 px-3">Price</th>
                <th className="pb-2.5 pl-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    Loading advertisements...
                  </td>
                </tr>
              ) : advertisements.length > 0 ? (
                advertisements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 pr-3 font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="py-3 px-3 text-gray-700">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-gray-800">
                      ৳{item.pricePerUnit}/{item.unit}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    No advertisements posted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Note */}
      <p className="text-[11px] text-gray-500 mt-5 pt-3 border-t border-gray-100 leading-relaxed">
        Under Review: price is far below the typical price for this material. An
        admin will check it.
      </p>
    </div>
  );
};

export default DashboardAdvertisements;
