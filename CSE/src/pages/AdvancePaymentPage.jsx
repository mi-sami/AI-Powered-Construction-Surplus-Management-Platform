import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthInfo from "../Hook/useAuthInfo";
import PaymentSummaryCard from "../Component/AdvancePayment/PaymentSummaryCard";
import PaymentMethodSelector from "../Component/AdvancePayment/PaymentMethodSelector";

const AdvancePaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthInfo();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("bKash");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchPaymentContext = async () => {
      try {
        const prodRes = await axios.get(`http://localhost:5000/listings/${id}`);
        setProduct(prodRes.data);
      } catch (error) {
        console.error("Error loading advance payment page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentContext();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center text-sm text-gray-500">
        Loading payment details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center">
        <p className="text-sm text-gray-600 mb-4">Listing not found.</p>
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="px-4 py-2 bg-[#008ba9] text-white text-xs font-semibold rounded cursor-pointer"
        >
          ← Back to Search
        </button>
      </div>
    );
  }

  // মূল্য হিসাব
  const totalAmount =
    Number(product.totalPrice) ||
    Number(product.quantity || 1) * Number(product.pricePerUnit || 0);

  const currentAdvance = Number(product.advanceAmount || 0);
  const dueBalance = Math.max(0, totalAmount - currentAdvance);

  const handleConfirmOrder = async () => {
    setPaying(true);
    try {
      const now = new Date();
      const orderId = `ORD-${Date.now()}`;
      const receiptNo = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
      const transactionId = `TXN-${Date.now().toString().slice(-8)}`;
      const formattedDateTime = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const newOrder = {
        id: orderId,
        receiptNo,
        transactionId,
        dateTime: formattedDateTime,
        listingId: product.id,
        listingTitle: product.title,
        quantity: Number(product.quantity || 1),
        unit: product.unit || "unit",
        unitPrice: Number(product.pricePerUnit || 0),
        buyerId: user?.id || "buyer_1",
        buyerName: user?.name || "Buyer",
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        totalAmount,
        advancePaid: currentAdvance,
        dueBalance,
        paymentMethod: selectedMethod,
        status: "confirmed",
        createdAt: now.toISOString().split("T")[0],
      };

      // ১. অর্ডার সেভ করা
      await axios.post("http://localhost:5000/orders", newOrder);

      // ২. সেলারের কাছে Order Confirm ও Receipt-এর নোটিফিকেশন পাঠানো
      await axios.post("http://localhost:5000/notifications", {
        id: `notif_${Date.now()}`,
        userId: product.sellerId,
        type: "ORDER_CONFIRMED",
        orderId: orderId,
        receiptNo: receiptNo,
        listingId: product.id,
        title: "New Order Confirmed & Receipt Ready",
        message: `${user?.name || "A buyer"} confirmed an order for "${product.title}" and paid ৳${currentAdvance.toLocaleString()} advance. Click to view payment receipt.`,
        isRead: false,
        createdAt: now.toISOString(),
      });

      // ৩. বায়ারকে সরাসরি Payment Receipt পেজে নিয়ে যাওয়া
      navigate(`/receipt/${orderId}`);
    } catch (error) {
      console.error("Order confirmation error:", error);
      alert("Failed to confirm order.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 py-10 px-4 sm:px-6 flex justify-center items-start">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200/90 p-6 sm:p-7 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(`/product/${product.id}`)}
          className="text-xs font-semibold text-[#008ba9] hover:underline mb-4 inline-block cursor-pointer"
        >
          ← Back to Product Details
        </button>

        <h1 className="text-xl font-bold text-gray-900 mb-5">
          Advance payment
        </h1>

        {/* Pricing Summary */}
        <PaymentSummaryCard
          totalAmount={totalAmount}
          currentAdvance={currentAdvance}
          dueBalance={dueBalance}
          isReducedBySeller={false}
        />

        {/* Payment Method & Confirmation */}
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
          onConfirmOrder={handleConfirmOrder}
          paying={paying}
        />
      </div>
    </div>
  );
};

export default AdvancePaymentPage;