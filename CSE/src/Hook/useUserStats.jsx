import { useState, useEffect } from "react";
import { handleApiAction } from "../Utils/ApiHandler";

const useUserStats = (user) => {
  const [activeListingsCount, setActiveListingsCount] = useState("n");
  const [ordersCount, setOrdersCount] = useState("n");

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        const listings = await handleApiAction({ action: "GET", target: "listings" });
        const userListings = listings.filter((item) => item.sellerId === user.id);
        setActiveListingsCount(userListings.length);
      } catch (err) {
        setActiveListingsCount("n");
      }

      try {
        const orders = await handleApiAction({ action: "GET", target: "orders" });
        const userOrders = orders.filter((item) => item.buyerId === user.id);
        setOrdersCount(userOrders.length);
      } catch (err) {
        setOrdersCount("n");
      }
    };

    fetchStats();
  }, [user]);

  return { activeListingsCount, ordersCount };
};

export default useUserStats;