import React from "react";
import { useTranslation } from "react-i18next";

const SellerWhatsAppCard = ({ product }) => {
  const { t } = useTranslation();
  const sellerName =
    product?.sellerName || t("productDetails.info.defaultSeller");
  const rawPhone =
    product?.sellerPhone || product?.whatsappPhone || product?.phone || "";
  const replyTime =
    product?.replyTime || t("productDetails.whatsapp.defaultReplyTime");

  const getFullWhatsAppNumber = (phone) => {
    if (!phone) return "";
    let digits = phone.toString().replace(/\D/g, "");

    if (digits.startsWith("01") && digits.length === 11) {
      digits = "88" + digits;
    } else if (digits.startsWith("1") && digits.length === 10) {
      digits = "880" + digits;
    }
    return digits;
  };

  const fullNumber = getFullWhatsAppNumber(rawPhone);
  const whatsappUrl = fullNumber ? `https://wa.me/${fullNumber}` : "";

  const handleOpenWhatsApp = () => {
    if (!whatsappUrl) {
      alert(t("productDetails.whatsapp.noNumber"));
      return;
    }
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-6 shadow-sm">
      {/* Header Row */}
      <div className="flex items-center gap-2.5 mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {t("productDetails.whatsapp.heading")}
        </h3>
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
            {t("productDetails.whatsapp.replyNote", {
              sellerName,
              replyTime,
            })}
          </p>
        </div>
      </div>

      {/* Direct Connect Button */}
      <button
        type="button"
        onClick={handleOpenWhatsApp}
        className="w-full py-3 bg-[#198744] hover:bg-[#146c36] text-gray-950 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
      >
        {t("productDetails.whatsapp.chatButton")}
      </button>

      {/* Safety Footer Note */}
      <p className="text-xs text-gray-500 leading-relaxed mt-4">
        {t("productDetails.whatsapp.safetyNote")}
      </p>
    </div>
  );
};

export default SellerWhatsAppCard;