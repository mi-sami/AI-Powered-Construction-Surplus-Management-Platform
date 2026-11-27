import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuthInfo from "../Hook/useAuthInfo";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ProfileInfo from "../Component/Profilecomponent/ProfileInfo.jsx";
import AccountDetails from "../Component/Profilecomponent/AccountDetails.jsx";
import MyProjects from "../Component/Profilecomponent/MyProjects.jsx";
import { handleApiAction } from "../Utils/ApiHandler";
import { fetchUserStats } from "../Feature/userStatsSlice";
import { fetchListings, deleteListingThunk } from "../Feature/listingSlice";

const Profile = () => {
  const { t } = useTranslation();
  const { user, setUser, logOut } = useAuthInfo();
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isCompany = user?.type === "Company";

  // Redux Selectors
  const { activeListingsCount, ordersCount } = useSelector(
    (state) => state.userStats,
  );
  const { items: allListings, loading: listingsLoading } = useSelector(
    (state) => state.listings,
  );

  // Filter current user's advertisements / listings
  const userListings = allListings.filter(
    (item) => item.sellerId === user?.id || item.userId === user?.id,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
   
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserStats(user.id));
      dispatch(fetchListings());
      dispatch(fetchListings());

      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      setValue("address", user.address || "");
      setValue(
        "licenseOrNid",
        isCompany ? user.tradeLicenseNo || "" : user.nidNo || "",
      );
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmNewPassword", "");
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmNewPassword", "");
    }
  }, [user, dispatch, setValue, isCompany]);

  const handleResetForm = () => {
    setUpdateSuccess("");
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      licenseOrNid: isCompany ? user?.tradeLicenseNo || "" : user?.nidNo || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handleLogout = () => {
    if (typeof logOut === "function") {
      logOut();
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
    navigate("/", { replace: true });
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    setUpdateSuccess("");

    if (formData.newPassword) {
      if (String(formData.currentPassword) !== String(user.password)) {
        alert(t("profilePage.incorrectPassword"));
        setLoading(false);
        return;
      }
    }

    const updatePayload = {
      id: user.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      ...(formData.newPassword ? { password: formData.newPassword } : {}),
    };

    try {
      const updatedUserResponse = await handleApiAction({
        action: "EDIT",
        target: "users",
        payload: updatePayload,
        payload: updatePayload,
      });

      if (updatedUserResponse) {
        
        const newUserData = {
          ...user,
          ...updatePayload,
          ...updatedUserResponse,
        };
        setUser(newUserData);
        localStorage.setItem("user", JSON.stringify(newUserData));

        setValue("currentPassword", "");
        setValue("newPassword", "");
        setValue("confirmNewPassword", "");

        setUpdateSuccess(
          formData.newPassword
            ? t("profilePage.profileAndPasswordUpdated")
            : t("profilePage.profileUpdated"),
        );
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert(t("profilePage.updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    navigate("/add-advertisement");
  };


  const handleDeleteListing = async (id) => {
    try {
      await dispatch(deleteListingThunk(id)).unwrap();
      alert(t("profilePage.deleteSuccess"));
    } catch (error) {
      alert(t("profilePage.deleteFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("profilePage.title")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t("profilePage.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <ProfileInfo
              user={user}
              activeListingsCount={activeListingsCount}
              ordersCount={ordersCount}
              handleLogout={handleLogout}
            />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <AccountDetails
              isCompany={isCompany}
              register={register}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              errors={errors}
              loading={loading}
              updateSuccess={updateSuccess}
              reset={handleResetForm}
              watch={watch}
              
              
            />

            <MyProjects
              projects={userListings}
              loading={listingsLoading}
              onAddProject={handleAddProject}
              onDeleteProject={handleDeleteListing}
              
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;