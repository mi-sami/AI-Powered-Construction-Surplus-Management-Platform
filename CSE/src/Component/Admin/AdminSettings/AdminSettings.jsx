import React, { useState } from "react";
import { Settings, Save } from "lucide-react";

const AdminSettings = () => {
  const [autoFlagThreshold, setAutoFlagThreshold] = useState(75);
  const [requireApproval, setRequireApproval] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage("Admin portal preferences saved.");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full mb-2">
          <Settings className="w-3.5 h-3.5" /> Configuration
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          System Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure account verification rules and automated risk thresholds.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl border border-purple-200/70 p-6 shadow-xs space-y-5"
      >
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1.5">
            Auto-Flag Risk Score Threshold (0 - 100)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={autoFlagThreshold}
            onChange={(e) => setAutoFlagThreshold(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-purple-200 text-xs focus:outline-none focus:border-purple-600"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={requireApproval}
            onChange={(e) => setRequireApproval(e.target.checked)}
            className="w-4 h-4 accent-purple-700"
          />
          <span className="text-xs font-medium text-gray-800">
            Require NID / Trade License admin approval before new users can log in
          </span>
        </label>

        {savedMessage && (
          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 font-medium">
            {savedMessage}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Settings</span>
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;