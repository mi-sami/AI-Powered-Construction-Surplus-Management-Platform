import React, { useState, useEffect } from "react";
import { handleApiAction } from "../../../Utils/ApiHandler";

const FlaggedListings = ({ flaggedItems, setFlaggedItems, loading }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (flaggedItems.length > 0 && !selectedItem) {
      setSelectedItem(flaggedItems[0]);
    }
  }, [flaggedItems, selectedItem]);

  const renderLevelBadge = (level) => {
    const normalized = level?.toLowerCase();
    if (normalized === "high") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-medium rounded-full border border-red-400 text-red-700 bg-red-50">
          High
        </span>
      );
    }
    if (normalized === "medium") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-medium rounded-full border border-amber-500 text-amber-800 bg-amber-50">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-0.5 text-xs font-medium rounded-full border border-emerald-500 text-emerald-700 bg-emerald-50">
        Low
      </span>
    );
  };

  const handleModerationAction = async (actionType) => {
    if (!selectedItem) return;
    setActionMessage("");

    try {
      if (selectedItem.type === "listing") {
        if (actionType === "approve" || actionType === "false_positive") {
          await handleApiAction({
            action: "EDIT",
            target: "listings",
            payload: {
              id: selectedItem.id,
              status: "available",
              isSuspicious: false,
              reviewStatus: "Closed",
            },
          });
        } else if (actionType === "reject") {
          await handleApiAction({
            action: "EDIT",
            target: "listings",
            payload: {
              id: selectedItem.id,
              status: "rejected",
              isSuspicious: true,
              reviewStatus: "Closed",
            },
          });
        }
      }

      if (actionType === "warn" && selectedItem.sellerId) {
        await handleApiAction({
          action: "EDIT",
          target: "users",
          payload: {
            id: selectedItem.sellerId,
            warningCount: 1,
            lastWarnedAt: new Date().toISOString(),
          },
        });
      }

      if (actionType === "suspend" && selectedItem.sellerId) {
        await handleApiAction({
          action: "EDIT",
          target: "users",
          payload: {
            id: selectedItem.sellerId,
            isSuspended: true,
            status: "suspended",
          },
        });
      }
    } catch (err) {
      console.warn("API update skipped or item is mock:", err);
    }

    const updatedList = flaggedItems.map((item) =>
      item.id === selectedItem.id ? { ...item, reviewStatus: "Closed" } : item
    );
    setFlaggedItems(updatedList);
    setSelectedItem({ ...selectedItem, reviewStatus: "Closed" });

    const labels = {
      approve: "Listing approved and marked live.",
      false_positive: "Marked as false positive and closed.",
      reject: "Listing rejected and removed from marketplace.",
      warn: "Warning notice sent to seller.",
      suspend: "Seller account has been suspended.",
    };
    setActionMessage(labels[actionType] || "Action completed.");
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Flagged listings and accounts
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review what the system marked as suspicious.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Table Card */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-gray-200/90 p-6 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800 text-xs font-bold text-gray-900">
                  <th className="pb-3 pr-4">Listing / account</th>
                  <th className="pb-3 px-4">Seller</th>
                  <th className="pb-3 px-4">Risk</th>
                  <th className="pb-3 px-4">Level</th>
                  <th className="pb-3 pl-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      Loading flagged items...
                    </td>
                  </tr>
                ) : (
                  flaggedItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setActionMessage("");
                        }}
                        className={`cursor-pointer transition ${
                          isSelected ? "bg-[#f7f6f2]" : "hover:bg-gray-50/80"
                        }`}
                      >
                        <td className="py-3.5 pr-4 font-medium text-gray-900">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-gray-700">
                          {item.sellerName}
                        </td>
                        <td className="py-3.5 px-4 text-gray-700">
                          {item.riskScore}
                        </td>
                        <td className="py-3.5 px-4">
                          {renderLevelBadge(item.level)}
                        </td>
                        <td className="py-3.5 pl-4 text-gray-800">
                          {item.reviewStatus}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Details & Action Card */}
        {selectedItem && (
          <div className="lg:col-span-4 bg-white rounded-lg border border-gray-200/90 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedItem.title}
            </h2>

            <div className="mt-2">
              <span
                className={`inline-block px-3 py-0.5 text-xs font-medium rounded-full border ${
                  selectedItem.level?.toLowerCase() === "high"
                    ? "border-red-400 text-red-700 bg-red-50"
                    : selectedItem.level?.toLowerCase() === "medium"
                      ? "border-amber-500 text-amber-800 bg-amber-50"
                      : "border-emerald-500 text-emerald-700 bg-emerald-50"
                }`}
              >
                {selectedItem.level} risk
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Why it was flagged
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-700">
                {selectedItem.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              {selectedItem.images && selectedItem.images.length > 0 ? (
                <div className="border border-dashed border-gray-400 rounded-md p-2 bg-[#ebe8e1]">
                  <img
                    src={selectedItem.images[0]}
                    alt="Evidence"
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-[11px] text-center text-gray-600 mt-1">
                    Evidence: photos and history
                  </p>
                </div>
              ) : (
                <div className="h-24 rounded-md border border-dashed border-gray-400 bg-[#e5e2d9] flex items-center justify-center text-xs text-gray-600">
                  Evidence: photos and history
                </div>
              )}
            </div>

            {actionMessage && (
              <div className="mt-4 p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                {actionMessage}
              </div>
            )}

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => handleModerationAction("approve")}
                className="w-full py-2.5 px-4 rounded-md bg-[#b34200] hover:bg-[#993800] text-white text-xs font-bold transition cursor-pointer"
              >
                Approve listing
              </button>
              <button
                onClick={() => handleModerationAction("false_positive")}
                className="w-full py-2.5 px-4 rounded-md bg-white hover:bg-gray-50 text-gray-900 border border-gray-400 text-xs font-bold transition cursor-pointer"
              >
                Mark as false positive
              </button>
              <button
                onClick={() => handleModerationAction("reject")}
                className="w-full py-2.5 px-4 rounded-md bg-white hover:bg-gray-50 text-gray-900 border border-gray-400 text-xs font-bold transition cursor-pointer"
              >
                Reject and remove
              </button>
              <button
                onClick={() => handleModerationAction("warn")}
                className="w-full py-2.5 px-4 rounded-md bg-white hover:bg-gray-50 text-gray-900 border border-gray-400 text-xs font-bold transition cursor-pointer"
              >
                Warn seller
              </button>
              <button
                onClick={() => handleModerationAction("suspend")}
                className="w-full py-2.5 px-4 rounded-md bg-white hover:bg-red-50 text-gray-900 hover:text-red-700 border border-gray-400 text-xs font-bold transition cursor-pointer"
              >
                Suspend account
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FlaggedListings;