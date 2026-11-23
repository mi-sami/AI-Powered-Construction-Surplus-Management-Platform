import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MyProjects = ({
  projects = [],
  loading = false,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (typeof onAddProject === "function") {
      onAddProject();
    } else {
      navigate("/add-advertisement");
    }
  };

  const getStatusBadge = (status) => {
    const formattedStatus = status ? status.toLowerCase() : "available";

    if (formattedStatus === "available") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full border border-emerald-600 text-emerald-700 bg-emerald-50/50">
          {t("profilePage.ads.statusAvailable")}
        </span>
      );
    }
    if (formattedStatus === "under review" || formattedStatus === "pending") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full border border-amber-600 text-amber-800 bg-amber-50/50">
          {t("profilePage.ads.statusUnderReview")}
        </span>
      );
    }
    if (formattedStatus === "reserved") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-400 text-gray-700 bg-gray-100/50">
          {t("profilePage.ads.statusReserved")}
        </span>
      );
    }

    return (
      <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-300 text-gray-700 bg-gray-50">
        {status || t("profilePage.ads.statusActive")}
      </span>
    );
  };

  const handleDeleteClick = (id) => {
    if (window.confirm(t("profilePage.ads.confirmDelete"))) {
      if (typeof onDeleteProject === "function") {
        onDeleteProject(id);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 sm:p-8 shadow-sm">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {t("profilePage.ads.heading")}
        </h2>

        <button
          type="button"
          onClick={handleAddClick}
          className="px-4 py-2 bg-[#4f5bd5] hover:bg-[#2837dd] text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
        >
          {t("profilePage.ads.addButton")}
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800 text-xs font-bold text-gray-900">
              <th className="pb-3 pr-4">{t("profilePage.ads.colProduct")}</th>
              <th className="pb-3 px-4">{t("profilePage.ads.colCategory")}</th>
              <th className="pb-3 px-4">{t("profilePage.ads.colQuantity")}</th>
              <th className="pb-3 px-4">{t("profilePage.ads.colPrice")}</th>
              <th className="pb-3 px-4 text-center">
                {t("profilePage.ads.colStatus")}
              </th>
              <th className="pb-3 pl-4 text-right">
                {t("profilePage.ads.colActions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  {t("profilePage.ads.loading")}
                </td>
              </tr>
            ) : projects && projects.length > 0 ? (
              projects.map((item) => {
                const translatedCategory = item.category
                  ? t(`materialForm.categories.${item.category}`, {
                      defaultValue: item.category,
                    })
                  : "N/A";
                const translatedUnit = item.unit
                  ? t(`materialForm.units.${item.unit}`, {
                      defaultValue: item.unit,
                    })
                  : "";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Product Thumbnail & Title */}
                    <td className="py-4 pr-4 font-bold text-gray-900">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded border border-gray-300 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title || item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-medium">
                              {t("profilePage.ads.photo")}
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-2">
                          {item.title || item.name}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-gray-600">
                      {translatedCategory}
                    </td>

                    {/* Quantity */}
                    <td className="py-4 px-4 text-gray-700">
                      {item.quantity
                        ? `${item.quantity} ${translatedUnit}`
                        : "N/A"}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {item.pricePerUnit ? (
                        <div>
                          ৳{item.pricePerUnit}/
                          <br />
                          <span className="font-normal text-gray-600">
                            {translatedUnit || "unit"}
                          </span>
                        </div>
                      ) : (
                        "৳[price]"
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 pl-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/profile/edit-advertisement/${item.id}`)
                          }
                          className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
                        >
                          {t("profilePage.ads.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(item.id)}
                          className="px-3 py-1 bg-[#da3131] hover:bg-[#d10707] text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
                        >
                          {t("profilePage.ads.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  {t("profilePage.ads.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Information Note */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          {t("profilePage.ads.bottomNote")}
        </p>
      </div>
    </div>
  );
};

export default MyProjects;