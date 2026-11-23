import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchListings } from "../Feature/listingSlice";
import { handleApiAction } from "../Utils/ApiHandler";
import ProductPhotoCard from "../Component/ProductDetails/ProductPhotoCard";
import ProductInfoCard from "../Component/ProductDetails/ProductInfoCard";
import ProductDescriptionCard from "../Component/ProductDetails/ProductDescriptionCard";
import OrderActionCard from "../Component/ProductDetails/OrderActionCard";
import SellerWhatsAppCard from "../Component/ProductDetails/SellerWhatsAppCard";

const ProductDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: listings, loading } = useSelector((state) => state.listings);
  const product = listings.find(
    (item) => String(item.id) === String(id) || String(item._id) === String(id)
  );

  const [sellerAccount, setSellerAccount] = useState(null);

  useEffect(() => {
    if (listings.length === 0) {
      dispatch(fetchListings());
    }
  }, [dispatch, listings.length]);

  useEffect(() => {
    const fetchSellerAccount = async () => {
      if (!product?.sellerId) return;
      try {
        const users = await handleApiAction({ action: "GET", target: "users" });
        if (Array.isArray(users)) {
          const matchedSeller = users.find(
            (u) => String(u.id) === String(product.sellerId)
          );
          if (matchedSeller) setSellerAccount(matchedSeller);
        }
      } catch (error) {
        console.error("Failed to fetch seller info:", error);
      }
    };

    fetchSellerAccount();
  }, [product?.sellerId]);

  const handleBuyNow = () => {
    const targetId = product?.id || product?._id || id;
    if (!targetId) {
      alert("Product ID not found!");
      return;
    }
    navigate(`/advance-payment/${targetId}`);
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center text-gray-500 text-sm">
        {t("productDetails.loading")}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center">
        <p className="text-gray-600 text-sm mb-4">
          {t("productDetails.notFound")}
        </p>
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="px-4 py-2 bg-[#008ba9] text-white text-xs font-semibold rounded cursor-pointer"
        >
          {t("productDetails.backToSearch")}
        </button>
      </div>
    );
  }

  const enrichedProduct = {
    ...product,
    sellerName: sellerAccount?.name || product.sellerName,
    sellerPhone:
      sellerAccount?.whatsappPhone ||
      sellerAccount?.phone ||
      product.sellerPhone ||
      product.phone,
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/search")}
            className="text-xs font-semibold text-[#008ba9] hover:underline mb-2 inline-block cursor-pointer"
          >
            {t("productDetails.backToSearch")}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {product.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {t("productDetails.subtitle")}
          </p>
        </div>

        {/* Top 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <ProductPhotoCard image={product.image} title={product.title} />
          <ProductInfoCard product={enrichedProduct} />
        </div>

        {/* Middle Description Card */}
        <ProductDescriptionCard description={product.description} />

        {/* Bottom Ready to Order Action Bar */}
        <OrderActionCard product={enrichedProduct} onBuyNow={handleBuyNow} />
        <SellerWhatsAppCard product={enrichedProduct} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;