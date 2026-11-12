import React from 'react';

const AccountDetails = ({
  isCompany,
  register,
  handleSubmit,
  onSubmit,
  errors,
  loading,
  updateSuccess,
  reset,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Account details</h2>

      {updateSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded">
          {updateSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Full Name / Company Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {isCompany ? 'Company name' : 'Full name'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="[Full name]"
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
          />
          {errors.name && (
            <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="[email]"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="[phone]"
              {...register('phone', { required: 'Phone is required' })}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="[address]"
            {...register('address', { required: 'Address is required' })}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
          />
          {errors.address && (
            <span className="text-red-500 text-xs mt-1 block">{errors.address.message}</span>
          )}
        </div>

        {/* Readonly: NID / Trade License */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {isCompany ? 'Trade license no.' : 'NID no.'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled
            placeholder={isCompany ? '[Trade license no.]' : '[NID no.]'}
            {...register('licenseOrNid')}
            className="w-full px-3.5 py-2 bg-[#e8e6df]/50 border border-gray-300 rounded text-sm text-gray-700 cursor-not-allowed select-none"
          />
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Your {isCompany ? 'Trade license no.' : 'NID no.'} was verified by an admin. It is visible only to you and admins. Contact support to change it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#008ba9] hover:bg-[#007690] text-white text-sm font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default AccountDetails;