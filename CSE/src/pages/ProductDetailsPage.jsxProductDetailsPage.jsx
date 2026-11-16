import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchListings } from "../Feature/listingSlice";
import ProductPhotoCard from "../Component/ProductDetails/ProductPhotoCard";
import ProductInfoCard from "../Component/ProductDetails/ProductInfoCard";
import ProductDescriptionCard from "../Component/ProductDetails/ProductDescriptionCard";
import OrderActionCard from "../Component/ProductDetails/OrderActionCard";
import SellerWhatsAppCard from "../Component/ProductDetails/SellerWhatsAppCard";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: listings, loading } = useSelector((state) => state.listings);
  const product = listings.find((item) => String(item.id) === String(id));

  const [sellerAccount, setSellerAccount] = useState(null);

  // পেজ সরাসরি রিলোড হলে যেন Redux-এ ডাটা ফেচ হয়
  useEffect(() => {
    if (listings.length === 0) {
      dispatch(fetchListings());
    }
  }, [dispatch, listings.length]);

  // যেই অ্যাকাউন্ট থেকে advertisement তৈরি হয়েছে (sellerId), সেই অ্যাকাউন্টের নম্বর আনা
  useEffect(() => {
    const fetchSellerAccount = async () => {
      if (!product?.sellerId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/users/${product.sellerId}`
        );
        setSellerAccount(res.data);
      } catch (error) {
        console.error("Failed to fetch seller info:", error);
      }
    };

    fetchSellerAccount();
  }, [product?.sellerId]);

  const handleBuyNow = () => {
  navigate(`/advance-payment/${product.id}`);
};

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center text-gray-500 text-sm">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-12 text-center">
        <p className="text-gray-600 text-sm mb-4">Product not found.</p>
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

  // প্রোডাক্টে থাকা নম্বর অথবা সেলার অ্যাকাউন্ট থেকে আসা WhatsApp/Phone নম্বর মার্জ করা
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
            ← Back to Search
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {product.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Check the details before you order.
          </p>
        </div>

        {/* Top 2-Column Grid: Left Photo + Right Details */}
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