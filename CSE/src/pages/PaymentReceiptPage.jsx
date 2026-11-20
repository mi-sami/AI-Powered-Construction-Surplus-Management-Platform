import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReceiptHeader from "../Component/PaymentReceipt/ReceiptHeader";
import ReceiptMetadata from "../Component/PaymentReceipt/ReceiptMetadata";
import ReceiptMaterialTable from "../Component/PaymentReceipt/ReceiptMaterialTable";
import ReceiptPartiesInfo from "../Component/PaymentReceipt/ReceiptPartiesInfo";

const PaymentReceiptPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      try {
        const orderRes = await axios.get(
          `http://localhost:5000/orders/${orderId}`
        );
        const orderData = orderRes.data;
        setOrder(orderData);

        const [buyerRes, sellerRes] = await Promise.allSettled([
          axios.get(`http://localhost:5000/users/${orderData.buyerId}`),
          axios.get(`http://localhost:5000/users/${orderData.sellerId}`),
        ]);

        if (buyerRes.status === "fulfilled") setBuyerInfo(buyerRes.value.data);
        if (sellerRes.status === "fulfilled")
          setSellerInfo(sellerRes.value.data);
      } catch (error) {
        console.error("Failed to load payment receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptDetails();
  }, [orderId]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center text-sm text-gray-500">
        Loading payment receipt...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center">
        <p className="text-sm text-gray-600 mb-4">Receipt not found.</p>
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-[#008ba9] text-white text-xs font-semibold rounded cursor-pointer"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 print:hidden">
          <button
            type="button"
            onClick={() => navigate("/search")}
            className="text-xs font-semibold text-[#008ba9] hover:underline cursor-pointer"
          >
            ← Back to Search
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/90 p-6 sm:p-10 shadow-sm print:shadow-none print:border-none">
          {/* Component 1: Header & Download Button */}
          <ReceiptHeader onDownloadPDF={handleDownloadPDF} />

          {/* Component 2: Receipt Metadata */}
          <ReceiptMetadata order={order} />

          {/* Component 3: Material Pricing Table */}
          <ReceiptMaterialTable order={order} />

          {/* Component 4: Buyer & Seller Information */}
          <ReceiptPartiesInfo
            buyerInfo={buyerInfo}
            sellerInfo={sellerInfo}
            order={order}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptPage;