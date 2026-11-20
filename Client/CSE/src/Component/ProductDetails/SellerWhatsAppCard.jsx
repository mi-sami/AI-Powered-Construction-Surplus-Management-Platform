import React from "react";

const SellerWhatsAppCard = ({ product }) => {
  const sellerName = product?.sellerName || "Verified Seller";
  const rawPhone =
    product?.sellerPhone || product?.whatsappPhone || product?.phone || "";
  const replyTime = product?.replyTime || "1 hour";

  // আসল নম্বর ক্লিন করে আন্তর্জাতিক WhatsApp ফরম্যাটে (8801XXXXXXXXX) রূপান্তর
  const getFullWhatsAppNumber = (phone) => {
    if (!phone) return "";
    let digits = phone.toString().replace(/\D/g, ""); // সব '+', স্পেস, হাইফেন বাদ

    if (digits.startsWith("01") && digits.length === 11) {
      digits = "88" + digits; // 01712345678 -> 8801712345678
    } else if (digits.startsWith("1") && digits.length === 10) {
      digits = "880" + digits; // 1712345678 -> 8801712345678
    }
    return digits;
  };

  const fullNumber = getFullWhatsAppNumber(rawPhone);
  const whatsappUrl = fullNumber ? `https://wa.me/${fullNumber}` : "";

  const handleOpenWhatsApp = () => {
    if (!whatsappUrl) {
      alert("Seller WhatsApp number is not available for this account.");
      return;
    }
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-6 shadow-sm">
      {/* Header Row */}
      <div className="flex items-center gap-2.5 mb-4">
        <h3 className="text-lg font-bold text-gray-900">Talk to the seller</h3>
        <span className="px-2.5 py-0.5 text-xs font-semibold text-[#15803d] bg-[#f0fdf4] border border-[#16a34a] rounded-full">
          WhatsApp
        </span>
      </div>

      {/* Seller Info Box (Always Masked Number) */}
      <div className="bg-[#ebe8e3] rounded-lg p-4 flex items-center gap-4 mb-4">
        <div className="w-11 h-11 rounded-full bg-[#198744] flex items-center justify-center text-gray-900 font-bold text-base flex-shrink-0">
          W
        </div>

        <div className="min-w-0">
          <p className="text-base sm:text-lg font-bold text-gray-900 tracking-tight truncate">
            +880 1XXX-XXXXXX
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {sellerName} · usually replies within {replyTime}
          </p>
        </div>
      </div>

      {/* Direct Connect Button */}
      <button
        type="button"
        onClick={handleOpenWhatsApp}
        className="w-full py-3 bg-[#198744] hover:bg-[#146c36] text-gray-950 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
      >
        Chat on WhatsApp
      </button>

      {/* Safety Footer Note */}
      <p className="text-xs text-gray-500 leading-relaxed mt-4">
        Ask about delivery, pickup time or the material before you pay. Pay only
        through this page.
      </p>
    </div>
  );
};

export default SellerWhatsAppCard;