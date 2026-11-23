import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleApiAction } from "../Utils/ApiHandler";
import ReceiptHeader from "../Component/PaymentReceipt/ReceiptHeader";
import ReceiptMetadata from "../Component/PaymentReceipt/ReceiptMetadata";
import ReceiptMaterialTable from "../Component/PaymentReceipt/ReceiptMaterialTable";
import ReceiptPartiesInfo from "../Component/PaymentReceipt/ReceiptPartiesInfo";

const PaymentReceiptPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      try {
        const [allOrders, allUsers] = await Promise.all([
          handleApiAction({ action: "GET", target: "orders" }),
          handleApiAction({ action: "GET", target: "users" }),
        ]);

        const ordersList = Array.isArray(allOrders) ? allOrders : [];
        const usersList = Array.isArray(allUsers) ? allUsers : [];

        const matchedOrder = ordersList.find(
          (o) =>
            String(o.id) === String(orderId) ||
            String(o._id) === String(orderId) ||
            String(o.receiptNo) === String(orderId)
        );

        if (matchedOrder) {
          setOrder(matchedOrder);

          const matchedBuyer = usersList.find(
            (u) =>
              String(u.id) === String(matchedOrder.buyerId) ||
              String(u._id) === String(matchedOrder.buyerId)
          );
          const matchedSeller = usersList.find(
            (u) =>
              String(u.id) === String(matchedOrder.sellerId) ||
              String(u._id) === String(matchedOrder.sellerId)
          );

          if (matchedBuyer) setBuyerInfo(matchedBuyer);
          if (matchedSeller) setSellerInfo(matchedSeller);
        }
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
        {t("receiptPage.loading")}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center">
        <p className="text-sm text-gray-600 mb-4">{t("receiptPage.notFound")}</p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-[#008ba9] text-white text-xs font-semibold rounded cursor-pointer"
        >
          {t("receiptPage.backToDashboard")}
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
            {t("receiptPage.backToSearch")}
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