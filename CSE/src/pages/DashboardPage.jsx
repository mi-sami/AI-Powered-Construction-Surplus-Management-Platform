import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../Feature/listingSlice";
import { handleApiAction } from "../Utils/ApiHandler";
import useAuthInfo from "../Hook/useAuthInfo";
import DashboardStats from "../Component/Dashboard/DashboardStats";
import DashboardAdvertisements from "../Component/Dashboard/DashboardAdvertisements";
import DashboardRecentOrders from "../Component/Dashboard/DashboardRecentOrders";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuthInfo();
  const { items: allListings, loading: listingsLoading } = useSelector(
    (state) => state.listings
  );

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Listings এবং Orders ফেচ করা
  useEffect(() => {
    dispatch(fetchListings());

    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await handleApiAction({ action: "GET", target: "orders" });
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [dispatch]);

  // লগইন করা ইউজারের বিজ্ঞাপনসমূহ ফিল্টার
  const myListings = allListings.filter(
    (item) => String(item.sellerId) === String(user?.id)
  );

  // লগইন করা ইউজারের অর্ডারসমূহ (Buyer অথবা Seller হিসেবে)
  const myOrders = orders
    .filter(
      (order) =>
        String(order.buyerId) === String(user?.id) ||
        String(order.sellerId) === String(user?.id)
    )
    .map((order) => {
      const matchedListing = allListings.find(
        (l) => String(l.id) === String(order.listingId)
      );
      return {
        ...order,
        materialTitle: matchedListing?.title || "Construction Material",
        unit: matchedListing?.unit || "units",
      };
    });

  // Dynamic Stats Counts
  const activeAdsCount = myListings.filter(
    (item) => item.status?.toLowerCase() === "available"
  ).length;

  const underReviewCount = myListings.filter((item) => {
    const st = item.status?.toLowerCase();
    return st === "pending" || st === "under review";
  }).length;

  const awaitingAdvanceCount = myOrders.filter(
    (order) =>
      order.orderStatus?.toLowerCase() === "pending advance" ||
      order.paymentStatus?.toLowerCase() === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section (+ Add advertisement বাটন বাদ দেওয়া হয়েছে) */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Your listings, requirements and orders.
          </p>
        </div>

        {/* 3 Stats Cards (Open requirements বাদ দেওয়া হয়েছে) */}
        <DashboardStats
          activeAdsCount={activeAdsCount}
          awaitingAdvanceCount={awaitingAdvanceCount}
          underReviewCount={underReviewCount}
        />

        {/* Bottom 2-Column Grid: My Advertisements + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <DashboardAdvertisements
            advertisements={myListings}
            loading={listingsLoading}
          />
          <DashboardRecentOrders
            orders={myOrders}
            loading={ordersLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;