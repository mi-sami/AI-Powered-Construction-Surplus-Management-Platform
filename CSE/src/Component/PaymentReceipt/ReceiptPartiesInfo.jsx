import React from "react";
import { useTranslation } from "react-i18next";

const PartyDetailsColumn = ({ title, partyInfo, fallbackName, defaultType }) => {
  const { t } = useTranslation();
  const rawAccountType = partyInfo?.type || defaultType;

  const translatedAccountType =
    rawAccountType === "Company"
      ? t("profilePage.info.company")
      : t("profilePage.info.individual");

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>
      <div className="divide-y divide-gray-200 border-b border-gray-200 text-xs">
        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">{t("receiptPage.parties.name")}</span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.name || fallbackName || "N/A"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">
            {t("receiptPage.parties.accountType")}
          </span>
          <span className="font-semibold text-gray-900 text-right">
            {translatedAccountType}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">
            {t("receiptPage.parties.address")}
          </span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.address || "N/A"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">
            {t("receiptPage.parties.phone")}
          </span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.phone || "N/A"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">
            {t("receiptPage.parties.email")}
          </span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.email || "N/A"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">
            {rawAccountType === "Individual"
              ? t("receiptPage.parties.nidNo")
              : t("receiptPage.parties.tradeLicenseNo")}
          </span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.tradeLicenseNo || partyInfo?.nidNo || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ReceiptPartiesInfo = ({ buyerInfo, sellerInfo, order }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <PartyDetailsColumn
          title={t("receiptPage.parties.buyer")}
          partyInfo={buyerInfo}
          fallbackName={order.buyerName}
          defaultType="Individual"
        />

        <PartyDetailsColumn
          title={t("receiptPage.parties.seller")}
          partyInfo={sellerInfo}
          fallbackName={order.sellerName}
          defaultType="Company"
        />
      </div>

      <p className="text-xs text-gray-500">
        {t("receiptPage.parties.footerNote")}
      </p>
    </>
  );
};

export default ReceiptPartiesInfo;