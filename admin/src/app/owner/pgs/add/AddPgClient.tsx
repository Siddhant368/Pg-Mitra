"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";

export default function AddPgPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactPhone: "",
    type: "BOYS",
    totalRooms: "",
    totalBeds: "",
    rentRange: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        totalRooms: parseInt(formData.totalRooms) || 0,
        totalBeds: parseInt(formData.totalBeds) || 0,
        amenities: [],
      };

      const newPg = await fetchApi("/owner/pgs", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push(`/owner/pgs/${newPg._id || newPg.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create PG. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 sm:space-x-4 mb-2">
        <Link
          href="/owner/pgs"
          className="p-2 sm:p-2.5 bg-white rounded-xl border border-[#E1EAF4] text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#102A56] tracking-tight">
            Add New PG
          </h1>
          <p className="text-xs sm:text-sm text-[#7186A5] mt-0.5">
            Fill in the details to add a new property to your portfolio.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start text-xs sm:text-sm text-rose-700 shadow-xs">
          <AlertCircle className="h-5 w-5 text-rose-500 mr-2.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl border border-[#E1EAF4] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="name" className="block text-xs font-bold text-[#102A56]">
                PG / Hostel Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. Sunrise Elite PG"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label htmlFor="description" className="block text-xs font-bold text-[#102A56]">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] resize-none min-h-[80px]"
                placeholder="Briefly describe the property, amenities, nearby colleges..."
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label htmlFor="address" className="block text-xs font-bold text-[#102A56]">
                Full Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. 124, 5th Cross, Koramangala"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="city" className="block text-xs font-bold text-[#102A56]">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. Bangalore"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="state" className="block text-xs font-bold text-[#102A56]">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. Karnataka"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="pincode" className="block text-xs font-bold text-[#102A56]">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. 560001"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contactPhone" className="block text-xs font-bold text-[#102A56]">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                required
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. 9876543210"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="type" className="block text-xs font-bold text-[#102A56]">
                PG Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] bg-white min-h-[44px]"
              >
                <option value="BOYS">Boys Only</option>
                <option value="GIRLS">Girls Only</option>
                <option value="COLIVING">Co-living (Unisex)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="rentRange" className="block text-xs font-bold text-[#102A56]">
                Monthly Rent Range (optional)
              </label>
              <input
                type="text"
                id="rentRange"
                name="rentRange"
                value={formData.rentRange}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. 5000 - 8000"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="totalRooms" className="block text-xs font-bold text-[#102A56]">
                Total Rooms <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="totalRooms"
                name="totalRooms"
                required
                min="0"
                value={formData.totalRooms}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. 10"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="totalBeds" className="block text-xs font-bold text-[#102A56]">
                Total Bed Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                id="totalBeds"
                name="totalBeds"
                required
                min="0"
                value={formData.totalBeds}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAF4] focus:ring-2 focus:ring-[#0F8B83]/20 focus:border-[#0F8B83] outline-none transition-all text-xs sm:text-sm text-[#102A56] min-h-[44px]"
                placeholder="e.g. 30"
              />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-7 py-4 bg-[#F5F8FC] border-t border-[#E1EAF4] flex items-center justify-end gap-3">
          <Link
            href="/owner/pgs"
            className="px-5 py-2.5 text-[#7186A5] hover:text-[#102A56] font-bold text-xs sm:text-sm hover:bg-white rounded-xl transition-colors min-h-[44px] flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0F8B83] hover:bg-[#08756E] text-white rounded-xl transition-all font-bold text-xs sm:text-sm shadow-sm shadow-[#0F8B83]/20 focus:outline-none focus:ring-2 focus:ring-[#0F8B83] focus:ring-offset-2 disabled:opacity-70 min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Property</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
