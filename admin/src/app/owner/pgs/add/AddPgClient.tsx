"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

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

      router.push(`/owner/pgs/${newPg._id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create PG. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/owner/pgs" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Add New PG</h1>
          <p className="text-slate-500 mt-1">Fill in the details to add a new property to your portfolio.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start text-sm text-red-700">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">PG/Hostel Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="e.g. Sunrise Boys Hostel"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800 resize-none"
                placeholder="Briefly describe the property..."
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">Full Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="Street address, neighborhood"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="city" className="block text-sm font-medium text-slate-700">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="e.g. Bangalore"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="state" className="block text-sm font-medium text-slate-700">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="e.g. Karnataka"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="pincode" className="block text-sm font-medium text-slate-700">PIN Code *</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="e.g. 560001"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700">Contact Phone *</label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                required
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="e.g. 9876543210"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="type" className="block text-sm font-medium text-slate-700">PG Type *</label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800 bg-white"
              >
                <option value="BOYS">Boys Only</option>
                <option value="GIRLS">Girls Only</option>
                <option value="COLIVING">Co-living (Unisex)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="rentRange" className="block text-sm font-medium text-slate-700">Monthly Rent Range</label>
              <input
                type="text"
                id="rentRange"
                name="rentRange"
                value={formData.rentRange}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="e.g. 5000 - 8000"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="totalRooms" className="block text-sm font-medium text-slate-700">Total Rooms *</label>
              <input
                type="number"
                id="totalRooms"
                name="totalRooms"
                required
                min="0"
                value={formData.totalRooms}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="e.g. 10"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="totalBeds" className="block text-sm font-medium text-slate-700">Total Bed Capacity *</label>
              <input
                type="number"
                id="totalBeds"
                name="totalBeds"
                required
                min="0"
                value={formData.totalBeds}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none transition-all text-slate-800"
                placeholder="e.g. 30"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <Link
            href="/owner/pgs"
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2.5 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:ring-offset-2 disabled:opacity-70"
          >
            <Save className="mr-2 h-5 w-5" />
            {loading ? "Saving..." : "Save Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
