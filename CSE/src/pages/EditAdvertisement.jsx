import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MaterialPhotoUpload from "../Component/AddAdvertisement/MaterrialPhotoUpload.jsx";
import ProductDetailsForm from "../Component/AddAdvertisement/ProductDetailsForm.jsx";
import DangerZoneDelete from "../Component/EditAdvertisementComponent/DangerZoneDelete.jsx";
import { updateListingThunk, deleteListingThunk } from "../Feature/listingSlice";

const EditAdvertisement = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: listings } = useSelector((state) => state.listings);
  const currentAd = listings.find((item) => item.id === id);

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (currentAd) {
      reset({
        status: currentAd.status || "available",
        title: currentAd.title || "",
        category: currentAd.category || "Tiles",
        quantity: currentAd.quantity || "",
        unit: currentAd.unit || "sqft",
        condition: currentAd.condition || "Unused",
        pricePerUnit: currentAd.pricePerUnit || "",
        brand: currentAd.brand || "",
        location: currentAd.location || "",
        availableFrom: currentAd.availableFrom || "",
        description: currentAd.description || "",
      });
      setImageUrl(currentAd.image || "");
    }
  }, [currentAd, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    const updatedData = {
      ...currentAd,
      ...formData,
      image: imageUrl,
    };

    try {
      await dispatch(updateListingThunk(updatedData)).unwrap();
      alert("Advertisement updated successfully!");
      navigate("/profile");
    } catch (err) {
      alert("Failed to update advertisement.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove this advertisement?")) {
      try {
        await dispatch(deleteListingThunk(id)).unwrap();
        alert("Advertisement deleted.");
        navigate("/profile");
      } catch (err) {
        alert("Failed to delete advertisement.");
      }
    }
  };

  if (!currentAd) {
    return (
      <div className="p-12 text-center text-gray-500 font-medium min-h-screen bg-[#f7f6f2]">
        Loading advertisement details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Link & Header */}
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="text-xs font-semibold text-blue-700 hover:underline mb-2 block cursor-pointer"
        >
          ← Back to Profile
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit advertisement</h1>
        <p className="text-gray-500 text-xs mt-1 mb-8">
          Change the details of this product. Buyers see the updated advertisement after you save.
        </p>

        {/* Main Form Assembly */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Photo Upload + Danger Delete Box (Wrapped with small gap) */}
            <div className="lg:col-span-5 space-y-4">
              <MaterialPhotoUpload
                onImageSelect={(url) => setImageUrl(url)}
                previewUrl={imageUrl}
              />

              <DangerZoneDelete onDelete={handleDelete} />
            </div>

            {/* Right Column: Product Details Form */}
            <div className="lg:col-span-7">
              <ProductDetailsForm
                register={register}
                errors={errors}
                loading={loading}
                isEditMode={true}
                onSaveDraft={() => navigate("/profile")}
              />
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdvertisement;