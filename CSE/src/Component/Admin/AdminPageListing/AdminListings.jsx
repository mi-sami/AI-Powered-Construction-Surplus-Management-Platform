import React, { useState, useMemo } from "react";
import {
  Package,
  Search,
  Tag,
  Layers,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { handleApiAction } from "../../../Utils/ApiHandler";
const AdminListings = ({ listings = [], setListings, users = [], loading }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const st = (item.status || "available").toLowerCase();
      const matchesStatus = statusFilter === "all" || st === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [listings, statusFilter, searchQuery]);

  const counts = useMemo(
    () => ({
      all: listings.length,
      available: listings.filter(
        (i) => (i.status || "available").toLowerCase() === "available"
      ).length,
      pending: listings.filter(
        (i) => (i.status || "").toLowerCase() === "pending"
      ).length,
      rejected: listings.filter(
        (i) => (i.status || "").toLowerCase() === "rejected"
      ).length,
    }),
    [listings]
  );

  const selectedListing = useMemo(() => {
    if (filteredListings.length === 0) return null;
    return (
      filteredListings.find(
        (i) => String(i.id || i._id) === String(selectedListingId)
      ) || filteredListings[0]
    );
  }, [filteredListings, selectedListingId]);

  const getSellerName = (sellerId) => {
    const seller = users.find(
      (u) => String(u.id || u._id) === String(sellerId)
    );
    return seller ? seller.name : sellerId ? `Seller #${sellerId}` : "Unknown";
  };

  const handleListingStatusChange = async (targetItem, newStatus) => {
    if (!targetItem) return;
    const itemId = targetItem.id || targetItem._id;
    setActionLoading(true);
    setToastMessage("");

    try {
      await handleApiAction({
        action: "EDIT",
        target: "listings",
        payload: {
          id: itemId,
          status: newStatus,
        },
      });

      setListings((prev) =>
        prev.map((item) =>
          String(item.id || item._id) === String(itemId)
            ? { ...item, status: newStatus }
            : item
        )
      );

      setToastMessage(
        newStatus === "available"
          ? `"${targetItem.title}" is now live on the marketplace.`
          : `"${targetItem.title}" has been rejected and hidden.`
      );
    } catch (err) {
      console.error("Failed to update listing:", err);
      setToastMessage("Failed to update listing status. Check backend server.");
    } finally {
      setActionLoading(false);
    }
  };

  const renderListingBadge = (status) => {
    const normalized = (status || "available").toLowerCase();
    if (normalized === "available" || normalized === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-purple-300 text-purple-800 bg-purple-100/80">
          <CheckCircle2 className="w-3 h-3 text-purple-700" /> Live
        </span>
      );
    }
    if (normalized === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-red-300 text-red-700 bg-red-50">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-violet-300 text-violet-800 bg-violet-50">
        <Clock className="w-3 h-3 text-violet-600" /> {status}
      </span>
    );
  };

  return (
    <>
      {/* Header + Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full mb-2">
            <Package className="w-3.5 h-3.5" /> Inventory Catalog
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Marketplace Listings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Inspect surplus material batches, pricing, and availability status.
          </p>
        </div>

        {/* Purple Pill Filter Tabs */}
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-white border border-purple-200/80 shadow-xs">
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "available", label: "Live", count: counts.available },
            { key: "pending", label: "Pending", count: counts.pending },
            { key: "rejected", label: "Rejected", count: counts.rejected },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.key);
                  setToastMessage("");
                }}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] text-white shadow-sm shadow-purple-600/30"
                    : "text-gray-600 hover:text-purple-800 hover:bg-purple-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Listings Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-purple-200/70 p-6 shadow-xs">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search material title, category, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-purple-50/50 border border-purple-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-purple-900/80 text-xs font-bold text-gray-900">
                  <th className="pb-3 pr-4">Material</th>
                  <th className="pb-3 px-4">Seller</th>
                  <th className="pb-3 px-4">Price</th>
                  <th className="pb-3 px-4">Quantity</th>
                  <th className="pb-3 pl-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500">
                      Loading marketplace listings...
                    </td>
                  </tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500">
                      No matching listings found.
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((item) => {
                    const rowId = item.id || item._id;
                    const isSelected =
                      String(selectedListing?.id || selectedListing?._id) ===
                      String(rowId);

                    return (
                      <tr
                        key={rowId}
                        onClick={() => {
                          setSelectedListingId(rowId);
                          setToastMessage("");
                        }}
                        className={`cursor-pointer transition ${
                          isSelected
                            ? "bg-purple-50/90"
                            : "hover:bg-purple-50/40"
                        }`}
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-gray-900">
                            {item.title}
                          </div>
                          {item.category && (
                            <div className="text-[11px] text-purple-700">
                              {item.category}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-700">
                          {getSellerName(item.sellerId)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          {item.price} {item.currency || "BDT"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-700">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3.5 pl-4">
                          {renderListingBadge(item.status)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Listing Preview & Action Card */}
        {selectedListing && (
          <div className="lg:col-span-4 bg-white rounded-xl border border-purple-200/70 p-6 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedListing.title}
                </h2>
                <p className="text-[11px] font-semibold text-purple-700 mt-0.5">
                  {selectedListing.category || "Surplus Material"}
                </p>
              </div>
              {renderListingBadge(selectedListing.status)}
            </div>

            {/* Listing Image */}
            <div className="mt-4">
              {selectedListing.images && selectedListing.images.length > 0 ? (
                <div className="border border-dashed border-purple-300 rounded-lg p-2 bg-purple-50/50">
                  <img
                    src={selectedListing.images[0]}
                    alt={selectedListing.title}
                    className="w-full h-36 object-cover rounded"
                  />
                </div>
              ) : (
                <div className="h-28 rounded-lg border border-dashed border-purple-300 bg-purple-50/40 flex items-center justify-center text-xs text-purple-800/70">
                  No product photo uploaded
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="mt-4 space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Seller: {getSellerName(selectedListing.sellerId)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="font-semibold text-gray-900">
                  Price: {selectedListing.price}{" "}
                  {selectedListing.currency || "BDT"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>
                  Stock: {selectedListing.quantity} {selectedListing.unit}
                </span>
              </div>
              {selectedListing.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>{selectedListing.location}</span>
                </div>
              )}
            </div>

            {toastMessage && (
              <div className="mt-4 p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 font-medium">
                {toastMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 space-y-2.5">
              {(selectedListing.status || "available").toLowerCase() !==
                "available" && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleListingStatusChange(selectedListing, "available")
                  }
                  className="w-full py-2.5 px-6 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {actionLoading ? "Updating..." : "Approve & Publish"}
                  </span>
                </button>
              )}

              {(selectedListing.status || "").toLowerCase() !== "rejected" && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleListingStatusChange(selectedListing, "rejected")
                  }
                  className="w-full py-2.5 px-6 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4 text-purple-700" />
                  <span>Reject Listing</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminListings;