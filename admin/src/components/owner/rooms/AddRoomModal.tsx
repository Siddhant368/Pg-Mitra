"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle, Loader2, Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Pg, Room } from "@/types";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  pgs: Pg[];
  selectedPgId: string;
  onRoomAdded: (newRoom: Room) => void;
}

const ROOM_TYPES = [
  { value: "SINGLE", label: "Single Room (1 Bed)", defaultCapacity: 1 },
  { value: "DOUBLE", label: "Double Sharing (2 Beds)", defaultCapacity: 2 },
  { value: "TRIPLE", label: "Triple Sharing (3 Beds)", defaultCapacity: 3 },
  { value: "FOUR_SHARING", label: "Four Sharing (4 Beds)", defaultCapacity: 4 },
  { value: "CUSTOM", label: "Custom Capacity", defaultCapacity: 1 },
];

export default function AddRoomModal({
  isOpen,
  onClose,
  pgs,
  selectedPgId,
  onRoomAdded,
}: AddRoomModalProps) {
  const defaultPgId =
    selectedPgId || (pgs.length > 0 ? pgs[0]._id || pgs[0].id || "" : "");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const pgId = selectedPropertyId || defaultPgId;

  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState<string>("1");
  const [roomType, setRoomType] = useState("DOUBLE");
  const [bedCapacity, setBedCapacity] = useState<string>("2");
  const [monthlyRent, setMonthlyRent] = useState<string>("");
  const [securityDeposit, setSecurityDeposit] = useState<string>("");
  const [bathroomType, setBathroomType] = useState("ATTACHED");
  const [furnishing, setFurnishing] = useState("FURNISHED");
  const [description, setDescription] = useState("");

  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleRoomTypeChange = (newType: string) => {
    setRoomType(newType);
    const matched = ROOM_TYPES.find((t) => t.value === newType);
    if (matched && newType !== "CUSTOM") {
      setBedCapacity(matched.defaultCapacity.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setServerError("");

    const trimmedNumber = roomNumber.trim();
    if (!trimmedNumber) {
      setValidationError("Room number or name is required.");
      return;
    }

    if (!pgId) {
      setValidationError("Please select a PG / property.");
      return;
    }

    const capacityNum = parseInt(bedCapacity, 10);
    if (isNaN(capacityNum) || capacityNum < 1) {
      setValidationError("Bed capacity must be at least 1.");
      return;
    }

    const rentNum = parseFloat(monthlyRent);
    if (isNaN(rentNum) || rentNum < 0) {
      setValidationError("Monthly rent is required and must be non-negative.");
      return;
    }

    const floorNum = floor.trim() ? parseInt(floor, 10) : undefined;
    const depositNum = securityDeposit.trim() ? parseFloat(securityDeposit) : undefined;

    setSubmitting(true);

    const payload = {
      pgId,
      roomNumber: trimmedNumber,
      floor: isNaN(floorNum ?? NaN) ? 1 : floorNum,
      roomType,
      sharing: capacityNum,
      bedCapacity: capacityNum,
      rentPerBed: rentNum,
      monthlyRent: rentNum,
      ...(depositNum !== undefined && !isNaN(depositNum) && { securityDeposit: depositNum }),
      bathroomType,
      furnishing,
      ...(description.trim() && { description: description.trim() }),
    };

    try {
      // Attempt backend endpoint
      const response = await fetchApi(`/owner/pgs/${pgId}/rooms`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const createdRoom: Room = response || {
        _id: `room-${Date.now()}`,
        ...payload,
      };

      onRoomAdded(createdRoom);

      // Reset form
      setRoomNumber("");
      setMonthlyRent("");
      setSecurityDeposit("");
      setDescription("");
      onClose();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to create room. Please check your inputs.";
      setServerError(
        errMsg.includes("404") || errMsg.includes("Cannot POST")
          ? `Backend API route (POST /owner/pgs/${pgId}/rooms) is not yet implemented on the server: ${errMsg}. Inputs have been preserved.`
          : errMsg
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A56]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E1EAF4] shadow-2xl relative max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-room-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E1EAF4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F5] border border-[#0F8B83]/20 flex items-center justify-center text-[#0F8B83]">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 id="add-room-title" className="text-lg font-bold text-[#102A56]">
                Add New Room
              </h3>
              <p className="text-xs text-[#7186A5]">
                Configure room details, capacity, and monthly rent
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-xl text-[#7186A5] hover:text-[#102A56] hover:bg-[#F5F8FC] transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation / Server Error Banners */}
        {validationError && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-2 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {serverError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* 1. PG Selection */}
          <div>
            <label htmlFor="pg-select" className="block text-xs font-semibold text-[#102A56] mb-1">
              Select Property / PG *
            </label>
            <select
              id="pg-select"
              value={pgId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              disabled={submitting || (Boolean(selectedPgId) && pgs.length <= 1)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800 bg-white disabled:bg-slate-50"
            >
              {pgs.map((p) => {
                const id = p._id || p.id || "";
                return (
                  <option key={id} value={id}>
                    {p.name} {p.city ? `(${p.city})` : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2. Room Number / Name */}
            <div>
              <label htmlFor="room-number" className="block text-xs font-semibold text-[#102A56] mb-1">
                Room Number / Name *
              </label>
              <input
                type="text"
                id="room-number"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 101 or A-12"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            {/* 3. Floor */}
            <div>
              <label htmlFor="room-floor" className="block text-xs font-semibold text-[#102A56] mb-1">
                Floor (optional)
              </label>
              <input
                type="number"
                id="room-floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. 1"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            {/* 4. Room Type */}
            <div>
              <label htmlFor="room-type" className="block text-xs font-semibold text-[#102A56] mb-1">
                Room Type / Sharing *
              </label>
              <select
                id="room-type"
                value={roomType}
                onChange={(e) => handleRoomTypeChange(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800 bg-white"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Bed Capacity */}
            <div>
              <label htmlFor="bed-capacity" className="block text-xs font-semibold text-[#102A56] mb-1">
                Bed Capacity *
              </label>
              <input
                type="number"
                id="bed-capacity"
                required
                min="1"
                max="20"
                value={bedCapacity}
                onChange={(e) => setBedCapacity(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            {/* 6. Monthly Rent */}
            <div>
              <label htmlFor="monthly-rent" className="block text-xs font-semibold text-[#102A56] mb-1">
                Monthly Rent (₹ per bed) *
              </label>
              <input
                type="number"
                id="monthly-rent"
                required
                min="0"
                step="100"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g. 6500"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            {/* 7. Security Deposit */}
            <div>
              <label htmlFor="security-deposit" className="block text-xs font-semibold text-[#102A56] mb-1">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                id="security-deposit"
                min="0"
                step="500"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="e.g. 10000"
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            {/* 8. Bathroom Type */}
            <div>
              <label htmlFor="bathroom-type" className="block text-xs font-semibold text-[#102A56] mb-1">
                Bathroom Type
              </label>
              <select
                id="bathroom-type"
                value={bathroomType}
                onChange={(e) => setBathroomType(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800 bg-white"
              >
                <option value="ATTACHED">Attached Bathroom</option>
                <option value="SHARED">Shared Bathroom</option>
                <option value="COMMON">Common Hall Bathroom</option>
              </select>
            </div>

            {/* 9. Furnishing */}
            <div>
              <label htmlFor="furnishing" className="block text-xs font-semibold text-[#102A56] mb-1">
                Furnishing
              </label>
              <select
                id="furnishing"
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800 bg-white"
              >
                <option value="FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* 10. Notes / Description */}
          <div>
            <label htmlFor="room-description" className="block text-xs font-semibold text-[#102A56] mb-1">
              Description / Special Features (optional)
            </label>
            <textarea
              id="room-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Balcony attached, AC included, corner room..."
              disabled={submitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-forest-600 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1EAF4]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:ring-offset-2 disabled:opacity-70 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Room...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Room</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
