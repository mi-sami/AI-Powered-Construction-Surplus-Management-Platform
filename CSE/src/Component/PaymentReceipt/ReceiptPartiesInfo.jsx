import React from "react";

const PartyDetailsColumn = ({ title, partyInfo, fallbackName, defaultType }) => {
  const accountType = partyInfo?.type || defaultType;

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>
      <div className="divide-y divide-gray-200 border-b border-gray-200 text-xs">
        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">Name</span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.name || fallbackName || "N/A"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">Account type</span>
          <span className="font-semibold text-gray-900 text-right">
            {accountType}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">Address</span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.address || "N/A"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">Phone</span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.phone || "N/A"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">Email</span>
          <span className="font-semibold text-gray-900 text-right">
            {partyInfo?.email || "N/A"}
          </span>
        </div>

        <div className="py-2.5 flex justify-between gap-4">
          <span className="text-gray-500">
            {accountType === "Individual" ? "NID no." : "Trade license no."}
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
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <PartyDetailsColumn
          title="Buyer"
          partyInfo={buyerInfo}
          fallbackName={order.buyerName}
          defaultType="Individual"
        />

        <PartyDetailsColumn
          title="Seller"
          partyInfo={sellerInfo}
          fallbackName={order.sellerName}
          defaultType="Company"
        />
      </div>

      <p className="text-xs text-gray-500">
        Contact the other party using the company details above to arrange the
        material.
      </p>
    </>
  );
};

export default ReceiptPartiesInfo;