import React from 'react';

const ProfileInfo = ({ user, activeListingsCount, ordersCount, handleLogout }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm text-center">
      
      {/* Avatar Circle */}
      <div className="w-24 h-24 bg-[#e8e6df] rounded-full mx-auto flex items-center justify-center border border-gray-300 mb-4">
        <span className="text-3xl font-medium text-gray-700">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'I'}
        </span>
      </div>

      {/* Name */}
      <h2 className="text-lg font-bold text-gray-900 mb-2">
        {user?.name || '[Full name]'}
      </h2>

      {/* Badges */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <span className="px-3 py-0.5 bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium rounded-full">
          {user?.type || 'Individual'}
        </span>
        <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-medium rounded-full">
          {user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Approved'}
        </span>
      </div>

      {/* Account Info Details */}
      <div className="space-y-3 text-sm border-t border-gray-100 pt-4 mb-6 text-left">
        <div className="flex justify-between items-center text-gray-600">
          <span>Member since</span>
          <span className="font-semibold text-gray-900">
            {user?.createdAt || '[date]'}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-600 border-t border-gray-100 pt-2">
          <span>Active listings</span>
          <span className="font-semibold text-gray-900">[{activeListingsCount}]</span>
        </div>
        <div className="flex justify-between items-center text-gray-600 border-t border-gray-100 pt-2">
          <span>Orders</span>
          <span className="font-semibold text-gray-900">[{ordersCount}]</span>
        </div>
      </div>

      {/* Log Out Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded transition-colors cursor-pointer"
      >
        Log out
      </button>
    </div>
  );
};

export default ProfileInfo;