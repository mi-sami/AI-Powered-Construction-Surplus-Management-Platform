import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuthInfo from "../Hook/useAuthInfo";
import MaterialPhotoUpload from "../Component/AddAdvertisement/MaterrialPhotoUpload.jsx";
import ProductDetailsForm from "../Component/AddAdvertisement/ProductDetailsForm.jsx";
import { addListingThunk } from "../Feature/listingSlice";

const AddNewAdvertisement = () => {
  const { user } = useAuthInfo();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Tiles",
      unit: "sqft",
      condition: "Unused",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const newAdvertisement = {
      ...data,
      sellerId: user?.id || "u1",
      image: imageUrl || "https://via.placeholder.com/400x300?text=Material+Photo",
      currency: "BDT",
      status: "available",
      isSuspicious: false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      await dispatch(addListingThunk(newAdvertisement)).unwrap();
      alert("Advertisement published successfully!");
      navigate("/profile"); // Navigate back to profile/my-advertisements
    } catch (error) {
      console.error("Failed to publish advertisement:", error);
      alert("Failed to publish advertisement.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    alert("Saved as draft!");
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add new advertisement</h1>
          <p className="text-gray-500 text-sm mt-1">Upload a photo of the product.</p>
        </div>

        {/* Main Form Area */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Photo Upload Component */}
            <div className="lg:col-span-5">
              <MaterialPhotoUpload
                onImageSelect={(url) => setImageUrl(url)}
                previewUrl={imageUrl}
              />
            </div>

            {/* Right Column: Product Details Form Component */}
            <div className="lg:col-span-7">
              <ProductDetailsForm
                register={register}
                errors={errors}
                loading={loading}
                onSaveDraft={handleSaveDraft}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdvertisement;